marked.setOptions({
	gfm: true,
	breaks: true
});
marked.use(window.markedGfmHeadingId.gfmHeadingId());
marked.use(window.markedAlert.default ? window.markedAlert.default() : window.markedAlert());

const blog = document.querySelector('#blog-tab');
const index = document.querySelector('#index-tab')
const indexToggleButton = document.querySelector('[aria-label="Toggle Table of Contents"]')
var query = new URLSearchParams(window.location.search).get('q') || new URLSearchParams(window.location.search).get('query') || 'status/400.md';
var url = `${window.location.origin}/docs/${query}`;
var queryParts = query.split("/");
var indexUrl = queryParts[0] === "projects" ? `${window.location.origin}/docs/indexes/${queryParts[1]}.md` : null;

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

indexToggleButton.addEventListener('click', () => {
	if (blog.classList.contains('active')) {
		blog.classList.remove('active');
		index.classList.add('active');
	} else {
		blog.classList.add('active');
		index.classList.remove('active');
	}
});

(async function() {
	try {
		let response, content, indent;

		url = await statusChk(url);
		response = await fetch(url);
		content = await response.text();
		blog.innerHTML = marked.parse(content);
		Prism.highlightAll();

		if (indexUrl && indexUrl == await statusChk(indexUrl)) {
			response = await fetch(indexUrl);
			content = await response.text();
		} else {
			content='# Table of Contents\n\n'
			for (element of blog.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
				content += `${'  '.repeat(element.tagName.charAt(1))} - [${element.textContent}](#${element.id})\n`
			}
		}
		index.innerHTML = marked.parse(content);
		index.querySelectorAll('[href^="#"]').forEach(link => {
			link.addEventListener('click', (e) => {
				e.preventDefault();
				const targetId = link.getAttribute('href').substring(1);
				const targetElement = document.getElementById(targetId);
					if (!targetElement) return;
					indexToggleButton.click();
				requestAnimationFrame(() => {
					targetElement.scrollIntoView();
					history.pushState(null, '', `#${targetId}`)
				});
			});
		});

		if (window.location.hash) {
			const targetHeading = document.getElementById(window.location.hash.substring(1));
			if (targetHeading) {
				targetHeading.scrollIntoView();
			}
		}
		blog.classList.add('active')
	} catch (error) {
		console.error(error);
	}
})();
