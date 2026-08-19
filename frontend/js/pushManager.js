/**
 * Push Manager - Web Push notifications
 * إدارة الإشعارات الفورية
 */

class PushManager {
    constructor() {
        this.registration = null;
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
        
        if (this.isSupported) {
            this.init();
        } else {
            console.log('⚠️ Push notifications not supported');
        }
    }
    
    async init() {
        try {
            this.registration = await navigator.serviceWorker.ready;
            console.log('✅ Push manager initialized');
        } catch (error) {
            console.error('❌ Push manager init failed:', error);
        }
    }
    
    async subscribe() {
        if (!this.isSupported) {
            console.warn('⚠️ Push not supported');
            return null;
        }
        
        try {
            if (!this.registration) {
                await this.init();
            }
            
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.warn('⚠️ Push permission denied');
                return null;
            }
            
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    'BF7IlardTlVn6X4dNtcTad2ixM09jH87Q-vKyo5ScWY9uzLw3y-goXcgPmC8gxBpFWIGVgFWKxwC2pTDXNYnlD4'
                )
            });
            
            console.log('✅ Push subscription created');
            return subscription;
        } catch (error) {
            console.error('❌ Push subscription failed:', error);
            throw error;
        }
    }
    
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Make it globally available
window.PushManager = PushManager;