module.exports = {
    production : true,
    https_enable : true,
    ssl : {
        ca : "/home/yichung/ssl/ca_bundle.crt",
        cert : "/home/yichung/ssl/certificate.crt",
        key : "/home/yichung/ssl/private.key",
    },
    port : 2222,
    front_port: 5000,
}