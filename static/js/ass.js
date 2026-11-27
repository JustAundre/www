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
for (const project of document.querySelectorAll('#tab-list > .sidebar-tab')) {
	// Stub
}
