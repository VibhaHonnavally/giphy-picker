import React, { useState, useEffect } from 'react';
import { gif_limit } from './Constant';
import AlertComponent from './components/AlertComponent';
import ColumnGifs from './components/ColumnGifs';
import SearchComponent from './components/SearchComponent';
import LoadingComponent from './components/LoadingComponent';
import useInfiniteScroll from "./useInfiniteScroll";

import './App.css';

function App() {
  const [gifs_first, setGifsFirst] = useState([]);
  const [gifs_second, setGifsSecond] = useState([]);
  const [gifs_third, setGifsThird] = useState([]);
  const [gifs_forth, setGifsForth] = useState([]);
  const [initGifs, setInitGifs] = useState([]);
  const [apiResponseState, setApiResponseState] = useState(true);
  const giphySearchUrl = 'http://api.giphy.com/v1/gifs/search?api_key=uqij05W6u0Kx1OAtZBYJCPb2cHm3O4WM';
  const giphyTrendingUrl = 'http://api.giphy.com/v1/gifs/trending?api_key=uqij05W6u0Kx1OAtZBYJCPb2cHm3O4WM';
  const [isInitial, setInitialState] = useState(true);
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [beforeValue, setBeforeValue] = useState('');
  const [offsetVal, setOffSetVal] = useState(0);
  var beforeValue_ = '';
  var ajaxState = true;

  const [copySuccess, setCopySuccess] = useState(false);

  function fetchMoreListItems() {
    if (beforeValue) {
      var offsetValue = offsetVal + 1;
      setOffSetVal(offsetValue);
      var url = giphySearchUrl + '&q=' + beforeValue.replace(' ', '+') + `&limit=${gif_limit}&offset=${offsetValue * gif_limit}`;

      fetch(url, {
        method: 'get'
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        if (response.message === 'API rate limit exceeded') {
          setApiResponseState(false);

          var dd = JSON.parse(localStorage.getItem('gifs_data'));
          setGifsFirst(dd.first);
          setGifsSecond(dd.second);
          setGifsThird(dd.third);
          setGifsForth(dd.forth);

          setTimeout(() => setApiResponseState(true), 3000);
        }
        else {
          var data = response.data.map(function (g, i) {
            return g.images;
          });
          setIsFetching(false);
          setGifsFirst(gifs_first.concat(data.slice(0, gif_limit / 4)));
          setGifsSecond(gifs_second.concat(data.slice(gif_limit / 4, (gif_limit / 4) * 2)));
          setGifsThird(gifs_third.concat(data.slice(gif_limit / 4 * 2, (gif_limit / 4) * 3)));
          setGifsForth(gifs_forth.concat(data.slice(gif_limit / 4 * 3, gif_limit)));

          localStorage.setItem('gifs_data', JSON.stringify({
            first: gifs_first.concat(data.slice(0, gif_limit / 4)),
            second: gifs_second.concat(data.slice(gif_limit / 4, (gif_limit / 4) * 2)),
            third: gifs_third.concat(data.slice(gif_limit / 4 * 2, (gif_limit / 4) * 3)),
            forth: gifs_forth.concat(data.slice(gif_limit / 4 * 3, gif_limit))
          }));
        }
      });
    }
  }

  const copyToClipboard = (url) => {
    var textField = document.createElement('textarea')
    textField.innerText = url
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 1000)
  };

  const setGifsFunc = (url) => {
    fetch(url, {
      method: 'get'
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.message === 'API rate limit exceeded') {
        setApiResponseState(false);

        var dd = JSON.parse(localStorage.getItem('gifs_data'));
        setGifsFirst(dd.first);
        setGifsSecond(dd.second);
        setGifsThird(dd.third);
        setGifsForth(dd.forth);

        setTimeout(() => setApiResponseState(true), 3000);
      }
      else {
        var data = response.data.map(function (g, i) {
          return g.images;
        });

        setGifsFirst(gifs_first.concat(data.slice(0, gif_limit / 4)));
        setGifsSecond(gifs_second.concat(data.slice(gif_limit / 4, (gif_limit / 4) * 2)));
        setGifsThird(gifs_third.concat(data.slice(gif_limit / 4 * 2, (gif_limit / 4) * 3)));
        setGifsForth(gifs_forth.concat(data.slice(gif_limit / 4 * 3, gif_limit)));

        localStorage.setItem('gifs_data', JSON.stringify({
          first: gifs_first.concat(data.slice(0, gif_limit / 4)),
          second: gifs_second.concat(data.slice(gif_limit / 4, (gif_limit / 4) * 2)),
          third: gifs_third.concat(data.slice(gif_limit / 4 * 2, (gif_limit / 4) * 3)),
          forth: gifs_forth.concat(data.slice(gif_limit / 4 * 3, gif_limit))
        }));
      }
    });
  }

  const randomGifsFunc = (url) => {
    fetch(url, {
      method: 'get'
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.message === 'API rate limit exceeded') {
        setApiResponseState(false);

        setInitGifs(JSON.parse(localStorage.getItem('gifs_init_data')));

        setTimeout(() => setApiResponseState(true), 3000);
      }
      else {
        var gifs = response.data.map(function (g, i) {
          return g.images;
        });

        var random_x = Math.ceil(Math.random() * gifs.length);
        var random_y = Math.ceil(Math.random() * gifs.length);
        var random_z = Math.ceil(Math.random() * gifs.length);
        setInitGifs([gifs[random_x], gifs[random_y], gifs[random_z]]);
        localStorage.setItem('gifs_init_data', JSON.stringify([gifs[random_x], gifs[random_y], gifs[random_z]]));
      }
    });
  }

  useEffect(() => {
    randomGifsFunc(giphyTrendingUrl);
    setInterval(compareBeforeAfterValue, 1000);
  }, []);

  const compareBeforeAfterValue = () => {
    var afterValue = document.getElementById('searchKey').value;
    if (beforeValue_ === afterValue) {
      if (beforeValue_ !== '' && ajaxState) {
        setOffSetVal(0);
        setGifsFirst([]);
        setGifsSecond([]);
        setGifsThird([]);
        setGifsForth([]);
        setInitialState(false);
        ajaxState = false;

        var url = giphySearchUrl + '&q=' + beforeValue_.replace(' ', '+') + `&limit=${gif_limit}&offset=${offsetVal * gif_limit}`;
        setGifsFunc(url);
      }
    }
    else {
      ajaxState = true;
    }
    setBeforeValue(afterValue);
    beforeValue_ = afterValue;
  }

  var mybutton = document.getElementById('myBtn');
  window.onscroll = function () { scrollFunction() }; function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      mybutton.style.display = 'block';
    } else { mybutton.style.display = 'none'; }
  }

  const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <div className="App">
      <AlertComponent copySuccess={copySuccess} apiResponseState={apiResponseState} />
      <SearchComponent />
      <table>
        <tbody>
          <tr style={{ display: isInitial ? 'block' : 'none' }}>
            {
              initGifs.length ? initGifs.map((gif, i) => {
                return (
                  <td style={{ verticalAlign: 'top' }} className='col-md-4' key={i}>
                    <video autoPlay muted fluid="true" loop
                      onClick={() => copyToClipboard(gif.original.url)}
                      width='100%'
                      style={{ opacity: 0.8 }}
                      onMouseOver={(e) => e.target.style.opacity = 1}
                      onMouseOut={(e) => e.target.style.opacity = 0.8}
                    >
                      <source src={gif.original.mp4} type="video/mp4" />
                    </video>
                  </td>
                )
              }) : null
            }
          </tr>
          <tr style={{ display: isInitial ? 'none' : 'block' }}>
            <ColumnGifs gifs={gifs_first} copyToClipboard={copyToClipboard} classname='col-md-3' />
            <ColumnGifs gifs={gifs_second} copyToClipboard={copyToClipboard} classname='col-md-3' />
            <ColumnGifs gifs={gifs_third} copyToClipboard={copyToClipboard} classname='col-md-3' />
            <ColumnGifs gifs={gifs_forth} copyToClipboard={copyToClipboard} classname='col-md-3' />
          </tr>
        </tbody>
      </table>
      {(isFetching && !isInitial) ? <LoadingComponent /> : null}

      <button onClick={topFunction} id='myBtn' title="Go to Top">Top</button>
    </div>
  );
}

export default App;
