import _ from 'lodash-es';

// 로컬스토리지 사용 가능한 브러우져인지 확인
function isLocalStorageAvailable() {
	const test = 'test';

	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch (e) {
		return false;
	}
}

function getPathArrayFromPath(path) {
	return typeof path === 'string' ? path.split('/') : path;
}

export function getItem(path, defaultValue = null) {
	if (isLocalStorageAvailable() === true) {
		const pathArray = getPathArrayFromPath(path);
		const storageItem = JSON.parse(localStorage.getItem(pathArray[0]));

		if (pathArray.length === 1) {
			return storageItem || defaultValue;
		}

		return _.get(storageItem, pathArray.slice(1), defaultValue);
	} else {
		throw new Error('LocalStorage variables must not be undefined');
	}
}

export function setItem(path, data) {
	if (isLocalStorageAvailable() === true) {
		if (path === undefined || data === undefined) {
			throw new Error('LocalStorage variables must not be undefined');
		} else {
			const pathArray = getPathArrayFromPath(path);

			if (pathArray.length === 1) {
				return localStorage.setItem(pathArray[0], JSON.stringify(data));
			}

			const rootData = getItem(pathArray[0]) || {};

			_.set(rootData, pathArray, data);

			return localStorage.setItem(pathArray[0], JSON.stringify(rootData[pathArray[0]]));
		}
	} else {
		throw new Error('local storage is not available');
	}
}

// eslint-disable-next-line
export function removeItem(path) {
	if (!isLocalStorageAvailable()) {
		throw new Error('LocalStorage variables must not be undefined');
	}

	const pathArray = getPathArrayFromPath(path);

	if (pathArray.length === 1) {
		return localStorage.removeItem(path);
	}
	const rootData = getItem(path);

	setItem(
		pathArray[0],
		Object.entries(rootData).reduce((acc, [key, value], index) => {
			if (index === pathArray.length) {
				return acc;
			}

			return {
				...acc,
				[key]: value,
			};
		}, rootData),
	);
}
