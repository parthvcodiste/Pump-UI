import { backButton, viewport, miniApp, initData, init as initSdk, } from "@telegram-apps/sdk-react";

export function init(): void {
    initSdk();

    try {
        if (backButton.isSupported()) {
            if (!backButton.isMounted()) {
                backButton.mount();
            }
        }
    } catch (e) {
        console.error(e);
    }

    miniApp.mountSync();
    initData.restore();

}