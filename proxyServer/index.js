const express = require("express");
const httpProxy = require("http-proxy");
const dotenv = require("dotenv");

dotenv.config();
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;
const CDN_URL = process.env.AWS_CDN_URL || "";
const proxy = httpProxy.createProxy();
const prismaClient = new PrismaClient();


app.use(async (req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    const resolvesTo = `${CDN_URL}/outputs/${subdomain}/`;
    const clientIP = req.ip;
    console.log("HELLo")
    try {
        if (subdomain === 'getbuild' || subdomain === 'www') {
            return res.redirect('https://www.getbuild.io');
        }
        if(subdomain!=="ping"){
            await prismaClient.request.create({
                data: { projectName: subdomain, ipAddress: clientIP }
            });
        }
        if(subdomain==="proxy"){
            return res.send("Proxy server is running")
        }
    } catch (error) {
        console.error("Error creating request record:", error);
        return res.status(500).send("Internal Server Error");
    }

    proxy.web(req, res, {
        target: resolvesTo,
        changeOrigin: true,
        headers: {
            'X-Forwarded-For': clientIP,
            'X-Real-IP': clientIP,
            'X-Project-Path': "/outputs/" + subdomain
        }
    });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    if (req.url === "/") {
        proxyReq.path += "index.html";
    }
});

app.listen(PORT, () => {
    console.log("Server running atTTT PORT " + PORT);
});
