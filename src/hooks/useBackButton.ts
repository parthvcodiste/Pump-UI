import { useIsTelegram } from "@/components/telegram/TelegramProvider";
import { backButton } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useBackButton(page?: string, disableBack?: boolean, customHandler?: () => boolean) {
    const router = useRouter();
    const isTelegram = useIsTelegram();

    useEffect(() => {
        if (!isTelegram) {
            return;
        }
        if (backButton.show.isAvailable() && !backButton.isVisible()) {
            backButton.show();
        }

        const offClick = backButton.onClick(() => {
            if (disableBack) {
                return;
            }

            // Handle custom back logic if provided
            if (customHandler && customHandler()) {
                return;
            }

            if (page === "back") {
                router.back() ?? router.push("/");
            } else {
                router.push(page ? page : "/");
            }
        });

        return () => {
            offClick();
        };
    }, [disableBack, page, router, isTelegram, customHandler]);

    // Web fallback
    return () => {
        if (disableBack) {
            return;
        }

        // Handle custom back logic if provided
        if (customHandler && customHandler()) {
            return;
        }
    };
}
