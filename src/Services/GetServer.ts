export function getServer(): string | undefined {
    let ruServer = process.env.RU_SERV;
    let actualServer: string | undefined;
    if ('geolocation' in navigator) {
        //return dif servs
        actualServer = process.env.REACT_APP_SERVER_NAME_RU_SERVER;
    }
    else {
        actualServer = process.env.REACT_APP_SERVER_NAME_RU_SERVER;
    }
    return actualServer;
}