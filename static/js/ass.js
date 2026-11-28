// Apply divergent accent color of hovered project card to whole page
for (const project of document.querySelectorAll('.project-card')) {
	project.addEventListener('mouseenter', () => {
		if (root.getAttribute('data-motion') == 'true') {
			root.setAttribute('style', project.getAttribute('style'));
		}
	});
	project.addEventListener('mouseleave', () => {
		root.setAttribute('style', '');
	});
}
//
// Handle active states for sidebar tabs
const tabs = document.querySelectorAll('#tab-list > .sidebar-tab'),
	cardsGrid = document.querySelector('#cards-grid');
for (const activeTab of tabs) {
	activeTab.addEventListener('click', () => {
		for (const tab of tabs) {
			tab.removeAttribute('data-active');
		}
		activeTab.setAttribute('data-active', '');
		//
		// Switch out displayed cards to match the active sidebar tab
		(async function() {
			const response = await fetch(`/static/html/cards/${activeTab.getAttribute('data-directory')}.html`),
				html = await response.text();
			cardsGrid.innerHTML = html
		})();
	});
}
