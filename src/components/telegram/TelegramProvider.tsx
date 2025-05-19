"use client";
import { postEvent, retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export function useIsTelegram() {
    try {
        retrieveLaunchParams();
        return true;
    } catch (error) {
        // console.log("Error fetching Telegram launch params:", error);
    }
    return false;
}

const TelegramProvider = () => {
    useEffect(() => {
        postEvent("web_app_expand");
    }, []);

    return (
        <>
        </>
    );
}
export default TelegramProvider;