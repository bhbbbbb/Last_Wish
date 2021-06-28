module.exports = {
    production : false,
    https_enable : false,
    ssl : {
        ca : "/home/yichung/ssl/ca_bundle.crt",
        cert : "/home/yichung/ssl/certificate.crt",
        key : "/home/yichung/ssl/private.key",
    },
    port : 2222,
    front_port: 8080
}