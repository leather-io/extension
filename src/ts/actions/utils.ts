export const openPopup = (actionsUrl: string) => {
  window.open(
    actionsUrl,
    'Blockstack',
    'scrollbars=no,status=no,menubar=no,width=300px,height=200px,left=0,top=0'
  )  
}