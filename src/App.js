import React from 'react';
import './App.css';
import YdHooksRedux from './react-hooks-redux'
const {Provider, store} = YdHooksRedux({
  isDev: true,
  initialState: { info :'react hooks 模拟 redux', age: 0}
})

function timeoutData(a) {
  return new Promise( cb => setTimeout(() => cb(a + 1), 500))
}
//异步 action
const actionAdd = () => async(dispatch, ownState) => {
  const age = await timeoutData(ownState.age);
  dispatch({
    type: 'asyncAddCount',
    reducer(state) {
      return {...state, age}
    }
  })
}
//同步 action
// function actionAdd(){
//   return {
//     type: "addCount",
//     reducer(state){
//       return {...state, age: state.age + 1 }
//     }
//   }
// }
function Button() {
  function handleAdd(){
    store.dispatch(actionAdd())
  }
  return <button onClick={handleAdd}>click</button>
}
function Page() {
  const state = store.useContext()
  return (
    <>
    <span className="App-link"> {state.age}</span>
      <Button />
    </>
  )
}

export default function App() {
  return (
    <div id="root">
      <header className="App-header">
        <Provider>
          <Page/>
        </Provider>
      </header>
    </div>
  );
};
