marked.setOptions({
	gfm: true,
	breaks: true
});
marked.use(window.markedGfmHeadingId.gfmHeadingId());
marked.use(window.markedAlert.default ? window.markedAlert.default() : window.markedAlert());

const blog = document.querySelector('#blog-tab');
const toc = document.querySelector('#index-tab')
const tocToggleButton = document.querySelector('[aria-label="Toggle Table of Contents"]')
var query = new URLSearchParams(window.location.search).get('q') || new URLSearchParams(window.location.search).get('query') || 'status/400.md';
var url = `${window.location.origin}/docs/${query}`;
var tocUrl = `${window.location.origin}/docs/${query.split('/').slice(0, 2).join('/')}/Table of Contents.md`

// Debug function
async function delay(ms) {
	new Promise(resolve => setTimeout(resolve, ms));
}

function rerender(element) {
	element.classList.add('rerender')
	void element.offsetWidth
	element.classList.remove('rerender')
}

async function statusChk(url) {
	let check = await fetch(url, { method: 'HEAD' });
	if (!check.ok) {
		if (check.status == 400) {
			return 'status/400.md'
		} else if (check.status == 404) {
			return 'status/404.md'
		}
		return `${window.location.origin}/docs/${query}`;
	}
	return url
}

tocToggleButton.addEventListener('click', () => {
	if (blog.classList.contains('active')) {
		blog.classList.remove('active');
		toc.classList.add('active');
	} else {
		blog.classList.add('active');
		toc.classList.remove('active');
	}
	document.body.classList.remove('load');
	rerender(document.body)
	document.body.classList.add('load');
});

(async function() {
	try {
		let response, content, indent;

		url = await statusChk(url);
		response = await fetch(url);
		content = await response.text();
		blog.innerHTML = marked.parse(content);
		Prism.highlightAll();

		if (tocUrl == await statusChk(tocUrl)) {
			response = await fetch(tocUrl);
			content = await response.text();
		} else {
			content='# Table of Contents\n\n'
			for (element of blog.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
				content += `${'  '.repeat(element.tagName.charAt(1))} - [${element.textContent}](#${element.id})\n`
			}
		}
		toc.innerHTML = marked.parse(content);
		toc.querySelectorAll('[href^="#"]').forEach(link => {
	  	link.addEventListener('click', (e) => {
	    	e.preventDefault();
		    const targetId = link.getAttribute('href').substring(1);
		    const targetElement = document.getElementById(targetId);
				if (!targetElement) return;
				tocToggleButton.click();
		    requestAnimationFrame(() => {
					targetElement.scrollIntoView();
					history.pushState(null, '', `#${targetId}`)
		    });
		  });
		});

		document.body.classList.remove('load');
		rerender(document.body)
		document.body.classList.add('load');
		if (window.location.hash) {
			const targetHeading = document.getElementById(window.location.hash.substring(1));
			if (targetHeading) {
				targetHeading.scrollIntoView();
			}
		}
	} catch (error) {
		console.error(error);
	}
})();
