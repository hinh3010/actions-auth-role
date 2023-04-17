import express from 'express'
import { AuthRole } from '../simple'
import { type IError } from '../@types'

const app = express()
const authRole = new AuthRole()

const handlerError = (err: IError, _: any, res: any, __: any) => {
  return res.json({
    status: err.status ?? 500,
    message: err.message
  })
}

app.get('/', authRole.isUser, (req, res) => {
  res.send('Xin chào, đây là trang chủ!')
})

app.use(handlerError)

app.listen(3000, () => {
  console.log('Server đang chạy trên cổng 3000...')
})

// ts-node-esm src/tests/index.ts
