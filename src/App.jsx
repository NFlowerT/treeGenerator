import './App.css'
import * as React from 'react'
import NTree from "./NTree"

const App = () => {
    return (
        <NTree
            dnaArray={[window.location.hash]}
            rockAmount={2}
            islandSize={4}
        />
    )
}

export default App
