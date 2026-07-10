/* eslint-disable */
export function isHeadless() {
    const param = new URLSearchParams(location.search).get('headless')

    return param !== null && ['', '1', 'true'].includes(param)
}
