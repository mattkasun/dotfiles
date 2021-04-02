const DOMAIN = "chrome.todoist.com"
const EXT_DOMAIN = "ext.todoist.com"

const TIMEOUT_1_MIN = 15 * 60 * 1000

let TIMEOUT_WS_CONNECT = null
let WS_SOCKET = null

/*
 * For fetching the current location and title
 */
let CURRENT_LOCATION = {
    location: "",
    title: ""
}

function getCurrentLocationAndTitle() {
    return CURRENT_LOCATION
}

setInterval(function() {
    chrome.tabs.getSelected(null, function(tab) {
        if (tab) {
            CURRENT_LOCATION.location = tab.url
            CURRENT_LOCATION.title = tab.title
        }
    })
}, 200)

/*
 * For remebering the last viewed iframe URL
 */
let FRAME_SRC = null
function setFrameLocation(url) {
    if (url) {
        FRAME_SRC = url
        if (window.localStorage) localStorage["frame_src"] = url
    }
}

function getFrameLocation() {
    let saved = null

    if (window.localStorage) saved = window.localStorage["frame_src"]

    if (saved) return saved
    else return FRAME_SRC
}

function getSession() {
    return window.localStorage
}

/*
 * For updating task count badge and logging in/out
 */
function updateBadge(total_count, is_overdue) {
    if (total_count == 0) {
        chrome.browserAction.setBadgeText({ text: "" })
    } else {
        chrome.browserAction.setBadgeText({ text: "" + total_count })
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 255] })
    }
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (!request.type) {
        return
    }

    if (request.type == "init_ws_updates") {
        if (!WS_SOCKET) {
            bindToWSUpdates()
            checkTodoistCounts()
        }
    } else if (request.type == "reset_ws_updates") {
        updateBadge(0, false)
        if (WS_SOCKET) {
            WS_SOCKET.close()
            WS_SOCKET = null
        }
    }
})

// --- Update counts
function checkTodoistCounts() {
    const xhr = new XMLHttpRequest()

    xhr.open("GET", "https://" + EXT_DOMAIN + "/Agenda/getCount", true)

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                const counts = window.JSON.parse(xhr.responseText)
                updateBadge(counts.today + counts.overdue, counts.overdue > 0)
            } catch (e) {}
        }
    }

    xhr.send(null)
}

// --- Bind to web-socket updates
function bindToWSUpdates() {
    const xhr = new XMLHttpRequest()

    xhr.open("GET", "https://" + DOMAIN + "/API/v8/get_session_user", true)

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                const user = window.JSON.parse(xhr.responseText)

                WS_SOCKET = new WebSocket(user.websocket_url)

                WS_SOCKET.addEventListener("message", function() {
                    const data = JSON.parse(event.data)

                    if (data.type == "agenda_updated") {
                        checkTodoistCounts()
                    } else if (data.type == "token_reset") {
                        WS_SOCKET = null
                        bindToWSUpdates()
                    }
                })

                WS_SOCKET.addEventListener("close", function() {
                    _setBindToWSUpdatesTimeout(TIMEOUT_1_MIN)
                    WS_SOCKET = null
                })
            } catch (e) {}
        }
    }

    xhr.send(null)
}

function _setBindToWSUpdatesTimeout(timeout) {
    if (TIMEOUT_WS_CONNECT) clearTimeout(TIMEOUT_WS_CONNECT)
    TIMEOUT_WS_CONNECT = setTimeout(bindToWSUpdates, timeout)
}

/*
 * Initial
 */
bindToWSUpdates()
checkTodoistCounts()

/*
 * Option management
 */

const ExtensionOptions = {
    withDueToday: false
}

function readOptionFromStorage() {
    chrome.storage.sync.get(["withDueToday"], function(items) {
        ExtensionOptions.withDueToday = items.withDueToday
    })
}

chrome.storage.onChanged.addListener(readOptionFromStorage)
readOptionFromStorage()

function pad(num) {
    if (num < 10) {
        return "0" + num
    }
    return num
}

/*
 * iso date string format YYYY-MM-DD
 */
function isoDateOnly(date) {
    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    )
}

/*
 * Context menu adding
 */
function addToTodoistFromMenu(ev, tab) {
    const url = ev.pageUrl

    let text = (tab && tab.title) || ""
    if (ev.selectionText) {
        text = ev.selectionText
    }

    let content_to_add = url

    if (ev.linkUrl == text) {
        content_to_add = ev.linkUrl
    } else if (text.length > 0) {
        text = text.replace(/\(/g, "[").replace(/\)/g, "]")
        text = text.replace(/https?:\/\/[^\s]+/g, "")
        content_to_add = url + " (" + text + ")"
    }

    if (content_to_add.length === 0) return

    const notification_id = "add_to_todoist_" + new Date().getTime()
    const xhr = new XMLHttpRequest()

    xhr.open("POST", "https://" + DOMAIN + "/API/v8/items/add", true)

    xhr.onreadystatechange = function() {
        const opts = {
            type: "basic",
            iconUrl: "todoist_256.png"
        }

		if (xhr.readyState !== 4) return

        if (xhr.status == 200) {
            opts.title = "Added To Todoist"
            opts.message = text
        } else  {
            opts.title = "Could not add to Todoist"
            opts.message = "Please make sure you are logged in"
		}

        chrome.notifications.create(notification_id, opts)
        setTimeout(checkTodoistCounts, 500)

        setTimeout(function() {
            chrome.notifications.clear(notification_id)
        }, 5000)
    }

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

    let form_args = "content=" + encodeURIComponent(content_to_add)
    if (ExtensionOptions.withDueToday) {
		const today = isoDateOnly(new Date())
        form_args += "&date_string=today"
    }

    xhr.send(form_args)
}

chrome.contextMenus.create({
    title: chrome.i18n.getMessage("addToTodoist"),
    contexts: ["page", "selection", "link"],
    onclick: addToTodoistFromMenu
})
