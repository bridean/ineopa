(function () {
    const interestingTagNames = new Set(['H1', 'H2', 'SCRIPT']);

    const evaluatePage = () => {
        const body = document.body;
        if (!body) {
            return false;
        }

        return Array.from(body.children)
            .filter(element => !(element.tagName === 'SCRIPT' && /test-page-report\.js$/.test(element.src || '')))
            .some(element => !interestingTagNames.has(element.tagName));
    };

    const report = () => {
        const hasRichContent = evaluatePage();
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'test-page-analysis',
                url: window.location.href,
                hasRichContent,
            }, '*');
        }
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        report();
    } else {
        window.addEventListener('DOMContentLoaded', report, { once: true });
    }
})();
