const express = require(`express`)
const app = express()

const PORT = 3010

app.use(express.json())

// import the vessel routes
const vessel = require(`./api/vessel/vessel`)

app.use(`/api/vessel`, vessel.router)

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}. Happy hacking!`)
})