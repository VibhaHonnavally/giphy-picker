const ColumnGifs = ({ gifs, copyToClipboard }) => {
  return (
    <td className='col-md-3' style={{ verticalAlign: 'top' }}>
      {
        gifs.length ? gifs.map((gif, i) => {
          return (
            <video key={i} autoPlay muted fluid="true" loop
              onClick={() => copyToClipboard(gif.fixed_width_small.url)}
              width='100%'
              style={{ opacity: 0.8 }}
              onMouseOver={(e) => e.target.style.opacity = 1}
              onMouseOut={(e) => e.target.style.opacity = 0.8}
            >
              <source src={gif.fixed_width_small.mp4} type="video/mp4" />
            </video>
          )
        }) : null
      }
    </td>
  )
}

export default ColumnGifs;