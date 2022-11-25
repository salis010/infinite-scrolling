import * as React from 'react'
import * as ReactDOM from 'react-dom'
import 'tailwindcss/tailwind.css'
import { App } from './App'

const mountNode = document.getElementById('mountNode')

ReactDOM.render(<App />, mountNode)
