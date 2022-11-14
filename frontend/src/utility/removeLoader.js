// Removes the loader after the site has been fully loaded
export default function RemoveLoader() {
    const onPageLoad = () => {
        setTimeout(() => {
            document.getElementById("loader_block").style.opacity = 0;
            setTimeout(() => {
                // Doing this without a timeout wouldn't play the fading opacity transition
                document.getElementById("loader_block").style.display = "none";
            }, 310);
        }, 200);
    };

    if (document.readyState === 'complete') onPageLoad();
    else {
        window.addEventListener('load', onPageLoad, false);
        return () => window.removeEventListener('load', onPageLoad);
    }
}