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
	return `<object id="obj" ${Object.keys(attrs)
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
		case "/character_creator/new_char/": {
			title = "Character Creator";
			attrs = {
				data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "960",
				height: "600",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 23,
					bs: "adam",
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 0,
					ctc: "go",
					tlang: "en_US",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
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
<link rel="stylesheet" href="/html/css/cc.css.gz.css">
<script href="/html/js/common_combined.js.gz.js"></script>
</head>
<body style="margin:0px">
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
<div class="container container-cc">


        <ul class="breadcrumb">
            <li><a href="/html/create.html">Make a video</a></li>
            <li><a href="/character_creator/">Your Characters</a></li>
            <li class="active">Create a new character</li>
        </ul>

<div>
    <div id="char_creator_client" align="center">${toObjectString(attrs, params)}
</div>
</div>
</div>		
<div class="site-footer">
    <div class="container">
        <div class="site-footer-nav row">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>About GoAnimate</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="https://josephcrosmanplays532.github.io/about">Who we are</a></li>
                        <li><a href="https://resources.josephcrosmanplays532.github.io/careers/">Careers</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/contactus">Contact Us</a></li>
                        <li><a href="https://blog.josephcrosmanplays532.github.io/">Blog</a></li>
                        <li><a href="https://press.josephcrosmanplays532.github.io/">Press</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>GoAnimate Solutions</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="https://discord.gg/goanimate?hook=footer_button.site">Plans and Pricing</a></li>
                        <li><a href="https://discord.io/goanimate4schools?hook=footer_button.site">Plans for Federal Agencies</a></li>
                        <li><a href="https://goanimateforschools.github.io/" target="_blank">GoAnimate for Schools</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>Usage Guidelines</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="https://josephcrosmanplays532.github.io/termsofuse">Terms of Service</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/privacy">Privacy Policy</a></li>
                        <li><a href="//support.josephcrosmanplays532.github.io/hc/en-us/articles/202408574" target="_blank">Cancellation Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4>Getting Help</h4>
                    <ul class="list-unstyled">
                        <li><a href="https://resources.josephcrosmanplays532.github.io/">Resources</a></li>
                        <li><a href="https://support.josephcrosmanplays532.github.io/">Help Center</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-6">
                <div class="site-footer-socials-container">
                    Follow us on:
                    <ul class="site-footer-socials">
                        <li><a class="glyph-social glyph-facebook" href="https://www.facebook.com/GoAnimateInc"><span class="sr-only">Facebook</span></a></li>
                        <li><a class="glyph-social glyph-twitter" href="https://twitter.com/GoAnimate"><span class="sr-only">Twitter</span></a></li>
                        <li><a class="glyph-social glyph-linked-in" href="https://www.linkedin.com/company/goanimate"><span class="sr-only">LinkedIn</span></a></li>
                        <li><a class="glyph-social glyph-google-plus" href="https://plus.google.com/+goanimate"><span class="sr-only">Google+</span></a></li>
                        <li><a class="glyph-social glyph-youtube" href="https://www.youtube.com/user/GoAnimate"><span class="sr-only">YouTube</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="site-footer-copyright">
                    <img src="https://d3v4eglovri8yt.cloudfront.net/static/add8e214e09bd155/go/img/footer/logo_amazon.png" alt="AWS Partner Network">
                    &nbsp;&nbsp;&nbsp;
                    <div class="ga-copy">GoAnimate © 2021</div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
