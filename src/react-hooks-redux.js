import React from 'react';
const { createContext, useReducer, useContext } = React;

function middleWareLog(store, lastState, nextState, action){
  console.log('action type ', action.type)
  console.log('lastState ', lastState)
  console.log('nextState ', nextState)
}
//把reducer 集成到Action中
const reducerInAction = (state, action) => {
  if(typeof action.reducer === 'function'){
    return action.reducer(state)
  }
  return state
}

export default function createStore(params) {
  const {isDev, reducer, initialState, middleware} = {
    isDev: false,
    initialState : {},
    reducer: reducerInAction,
    middleware: [middleWareLog],
    ...params
  }
  const hooksReduxContext = createContext();
  //store 只有修改状态和得到状态 dispatch + state
  const store = {
    _state: initialState,
    dispatch: undefined,
    useContext: function() {
      return useContext(hooksReduxContext)
    },
    getState:function(){
      return store._state;
    }
  }
  let isCheckedmiddleWare = false
  const middleWareReducer = (lastState, action) => {
    //执行同步，处理状态；action修改state
    let nextState = reducer(lastState, action)
    if(!isCheckedmiddleWare) {
      if(!Array.isArray(middleware)) {
        throw new Error("错误：请设置 middleWare 为数组")
      }
      isCheckedmiddleWare = true
    }
    //中间件修改state
    for(let item of middleware) {
      const newState = item(store, lastState, nextState, action, isDev)
      if(newState) {
        nextState = newState
      }
    }
    store._state = nextState
    return nextState;
  }
  const Provider = props => {
    const [state, dispatch] = useReducer(middleWareReducer, initialState);
    if(!store.dispatch) {
      store.dispatch = async function(action){
        if(typeof action === "function") {
          await action(dispatch, store._state);
        }
        dispatch(action)
      }
    }
    return <hooksReduxContext.Provider {...props} value={state}></hooksReduxContext.Provider>
  }

  return {
    Provider,
    store
  }
}
