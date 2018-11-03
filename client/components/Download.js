import React from 'react'

class Download extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      fileName : `${this.props.sourceSite.slice(0, -4)} ${this.props.title}`,
    }
  }

  componentDidUpdate(prevProps){
    if(this.props.title !== prevProps.title ||
      this.props.sourceSite !== prevProps.sourceSite){
      this.setState({fileName : `${this.props.sourceSite} ${this.props.title}`})
    }
  }

  handleSubmit = event => {
    event.preventDefault()
    const textAsBlob = new Blob([this.props.recipe], {type : `text/plain`})
    const fileName = this.state.fileName
    const downloadLink = document.createElement(`a`)
    downloadLink.download = fileName
    downloadLink.innerHTML = `Download Recipe`
    downloadLink.href = window.URL.createObjectURL(textAsBlob)
    downloadLink.onclick = event => {document.body.removeChild(event.target)}
    downloadLink.style.display = `none`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    alert(`Saved to your default download location`)
  }

  render(){
    return (
      <form onSubmit={this.handleSubmit} id="download">
        <label htmlFor="fileName">Filename:</label>
        <input name="fileName" onChange={this.props.handleChange} value={this.state.fileName}/>
        <button type="submit">Download Recipe</button>
      </form>
    )
  }
}

export default Download
