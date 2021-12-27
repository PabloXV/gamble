import { writable } from 'svelte/store';
import { isClientEthInjected } from '../helpers/ssr.helpers';
import { ethereumProvider } from '../transport';
import { NOTIFICATION_APPROVAL } from '../constants';
import { requestAccount } from './wallet'

type NotificationState = {
	menuOpen: boolean;
};

const initialState: NotificationState = {
	menuOpen: false
};

const createNotification = () => {
	const { update, subscribe } = writable(initialState);

	/**
	 *
	 * @param open override the regular toggle by passing a boolean to open/close menu
	 */
	const toggleNotificationMenu = (menuOpen?: boolean) => {
		if (typeof open !== 'undefined') {
			update((s) => ({ ...s, menuOpen }));
			return;
		}

		update((s) => ({ ...s, menuOpen: !s.menuOpen }));
	};

	const approveNotifications = async () => {
		try {
			if (isClientEthInjected()) {
				requestAccount()
				const provider = await ethereumProvider();
				const signer = provider.getSigner();
				const signature = await signer.signMessage(NOTIFICATION_APPROVAL);
				const address = await signer.getAddress();
				return {
					signature,
					address
				};
			}
		} catch (err) {
			console.error(err);
		}
	};

	return {
		subscribe,
		toggleNotificationMenu,
		approveNotifications
	};
};

export const notificationStore = createNotification();
