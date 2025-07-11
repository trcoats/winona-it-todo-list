import './App.css'
import ToDoList from './components/ToDoList'
import ToDoListContextProvider from './store/ToDoListContext'


function App() {

  return (
    <>
      <ToDoListContextProvider>
        <ToDoList />
      </ToDoListContextProvider>
    </>
  )
}

export default App
