const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {		
		case "/videomaker/full/": {
			let presave =
				query.editcheck && query.editcheck.startsWith("e")
					? query.editcheck
					: `m-${fUtil[query.Autosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 0,
					ctc: "go",
					ut: 23,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					lid: 13,
					isLogin: "Y",
					retut: 0,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					themeId: "business",
					tlang: "en_US",
					presaveId: presave,
					goteam_draft_only: 0,
					isWide: 1,
					collab: 0,
					nextUrl: "/html/list.html",
				},
				allowScriptAccess: "always",
			};
			break;
		}
		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
	<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script>
<link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
<link rel="stylesheet" href="/html/css/studio.css.gz.css">
<script href="/html/js/common_combined.js.gz.js"></script>
</head>
<div id="studio_holder" style="margin:0px">
<nav class="navbar site-nav" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            <a class="navbar-brand" href="/dashboard/videos.html" title="GoAnimate Legacy Redesigned">
                <img src="/html/img/logo.png" alt="GoAnimate Legacy Redesigned">
            </a>
        </div>

        <ul class="nav site-nav-alert-nav hidden-xs">
            <li>
                <a href="/notifications.html" title="Notifications"><span class="glyph-pro glyph-bell"></a>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/student.html">Dashboard</a></li>
                        <li><a href="/dashboard/videos.html">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="/account.html">Account Settings</a></li>
                        <li><a href="/profile/you.html">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="/logoff.html">Logout</a></li>
                    </ul>
                </li><li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/students.html">Students</a></li>
                        <li><a href="/teachers.html">Teachers</a></li>
                        <li><a href="/videos.html">Videos</a></li>
                        <li><a href="/public_faq.html">FAQ</a></li>
                    </ul>
                </li>
                <li>
				<a class="hidden-sm hidden-md hidden-lg" href="/html/videomaker.html">Make a Video</a>
				<span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/html/videomaker.html">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>
<div id="studio_holder" style="margin:0px">${toObjectString(attrs, params)}
</div>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
