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
		
		case "/character_creator/": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "960",
				height: "1200",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
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
            <a class="navbar-brand" href="/dashboard/videos" title="GoAnimate Legacy Redesigned">
                <img src="/html/img/logo.png" alt="GoAnimate Legacy Redesigned">
            </a>
        </div>

        <ul class="nav site-nav-alert-nav hidden-xs">
            <li>
                <a href="/notifications" title="Notifications"><span class="glyph-pro glyph-bell"></a>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/student">Dashboard</a></li>
                        <li><a href="/dashboard/videos">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="/account">Account Settings</a></li>
                        <li><a href="/profile/you">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="/logoff">Logout</a></li>
                    </ul>
                </li><li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/students">Students</a></li>
                        <li><a href="/teachers">Teachers</a></li>
                        <li><a href="/videos">Videos</a></li>
                        <li><a href="/public_faq">FAQ</a></li>
                    </ul>
                </li>
                <li>
				<a class="hidden-sm hidden-md hidden-lg" href="/v/videomaker">Make a Video</a>
				<span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/v/videomaker">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>
<div class="container container-cc">
      <ul class="breadcrumb">
                <li><a href="/c/create">Make a video</a></li>
                <li class="active">Your Characters</li>
            </ul>
    
            <p>Browse characters already available in your theme and use them as a starting point to create new custom characters.</p>
    
    <div id="ccbrowser-container" align="center">
    ${toObjectString(attrs, params)}
    </div>
    </div>
	<div class="site-footer">
    <div class="container">
        <div class="site-footer-nav row">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>About GoAnimate</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/about">Who we are</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://resources.goanimate.com/careers/">Careers</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/contactus">Contact Us</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://blog.goanimate.com/">Blog</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://press.goanimate.com/">Press</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>GoAnimate Solutions</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/business/videoplans?hook=footer_button.site">Plans and Pricing</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/business/videoplans/federal?hook=footer_button.site">Plans for Federal Agencies</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate4schools.com/" target="_blank">GoAnimate for Schools</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4><span>Usage Guidelines</span></h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/termsofuse">Terms of Service</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://goanimate.com/privacy">Privacy Policy</a></li>
                        <li><a href="//web.archive.org/web/20180307222818/https://support.goanimate.com/hc/en-us/articles/202408574" target="_blank">Cancellation Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h4>Getting Help</h4>
                    <ul class="list-unstyled">
                        <li><a href="http://web.archive.org/web/20180307222818/https://resources.goanimate.com/">Resources</a></li>
                        <li><a href="http://web.archive.org/web/20180307222818/https://support.goanimate.com/">Help Center</a></li>
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
                        <li><a class="glyph-social glyph-facebook" href="http://web.archive.org/web/20180307222818/https://www.facebook.com/GoAnimateInc"><span class="sr-only">Facebook</span></a></li>
                        <li><a class="glyph-social glyph-twitter" href="http://web.archive.org/web/20180307222818/https://twitter.com/GoAnimate"><span class="sr-only">Twitter</span></a></li>
                        <li><a class="glyph-social glyph-linked-in" href="http://web.archive.org/web/20180307222818/https://www.linkedin.com/company/goanimate"><span class="sr-only">LinkedIn</span></a></li>
                        <li><a class="glyph-social glyph-google-plus" href="http://web.archive.org/web/20180307222818/https://plus.google.com/+goanimate"><span class="sr-only">Google+</span></a></li>
                        <li><a class="glyph-social glyph-youtube" href="http://web.archive.org/web/20180307222818/https://www.youtube.com/user/GoAnimate"><span class="sr-only">YouTube</span></a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="site-footer-copyright">
                    <img src="http://web.archive.org/web/20180307222818im_/https://d3v4eglovri8yt.cloudfront.net/static/f789d2b2551c1fb6/go/img/footer/logo_amazon.png" alt="AWS Partner Network">
                    &nbsp;&nbsp;&nbsp;
                    <div class="ga-copy">GoAnimate © 2021</div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>${stuff.pages[url.pathname] || ""}`
	);
	return true;
};
