import React, { useEffect, useState } from "react";
import "./styles.css";
import { trackPromise } from "react-promise-tracker";
import { Pagination } from "./pagination";
import { LoadingIndicator } from "./loadingIndicator";
import * as d3 from 'd3'
import { Circle_d3 } from "./Circle_d3";

// fetching: "https://swapi.dev/api/planets/"

//takes in list of planets fetched to display
const List = ({ planets }) => {
    if (!planets || planets.length === 0) return <p>No Matching Planets</p>;

    return (
        <ul>
            <p className="listTitle">List of matching Planets:</p>
            {planets.map((planet) => {
                return (
                    <li key="planet.name" className="listItem">
                        <span>{planet.name}</span>
                    </li>
                );
            })}
        </ul>
    );
};

//takes in component <List /> and wraps it in for loader
const ListLoader = (list) => { };

const fetchData = async (url_ = `https://swapi.dev/api/planets/?search=`) => {

    const checkStatus = res => res.ok ? Promise.resolve(res) : Promise.reject(new Error(res.statusText));

    const fetchDoc = (url) => fetch(url)
        .then(checkStatus)
        .then(res => res.json())
        // .then(res => resolve(res.results))  //not to be used in, when as template. Swapi stores in .results in json
        .catch(error => console.log("Encountered an error : ", error))

    const fetchAllPages = async (url, arr = []) => {
        const { results, next } = await fetchDoc(url); //de-struturing into results and next in JSON
        arr = [...arr, ...results];
        if (next !== null) {
            return fetchAllPages(next, arr);
        }
        // console.log("inside fetchdata ", url_, arr)

        return arr; //arr is collection of all fetched results
    }

    return fetchAllPages(url_);
};

// returns a card per data point
function Card(props) {
    const { name, diameter } = props.data;
    return (
        <div className="card">
            <p>
                {name}
            </p>
            <small>(d : {diameter})</small>
        </div>
    );
}

function CircleCard(props) {
    const { name, diameter } = props.data;
    return (
        <div className="circleCard">
            <p>
                {name}
            </p>
            <small>(d : {diameter})</small>
        </div>
    );
}



const App = (props) => {

    // const [email, setEmail] = useState("not fetched");
    const [searchText, setSearchText] = useState("");   //textField text, always 'set' 
    const [planets, setPlanets] = useState([]);         //stores fetched planets, as array
    const [error, setError] = useState("");             //error to show, when failed to fetch planets
    const [showSortButton, setShowSortButton] = useState(false);

    const [appState, setAppState] = useState({
        loading: false,
        planets: null,
        serachTxt: ""
    });
    const url = `https://swapi.dev/api/planets/?search=`;

    const fetchPlanetsHelper = (url, planetList, resolve, reject) => {
        fetch(url)
            .then(response_ => { return response_.json(); })
            .then((response) => {
                const retrievedPlanetList = planetList.concat(response.results);

                if (response.next !== null) {

                    fetchPlanetsHelper(
                        response.next,
                        retrievedPlanetList,
                        resolve,
                        reject
                    );
                } else {
                    resolve(retrievedPlanetList);
                }
            })
            .catch((error) => {
                console.log(error);
                reject("Something wrong. Please refresh the page and try again.");
            });
    };

    const fetchPlanets2 = (url) => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                const planetList = [];
                fetchPlanetsHelper(url, planetList, resolve, reject);
                return planetList;
            }, 3000);
        });

        return promise;
    };

    const fetchPlanets = (url) => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(
                    fetch(url).then((response) => {
                        const a = "p";
                        return response.json();
                    })
                );
            }, 3000);
        });

        return promise;
    };

    const showButtonClick = () => {
        trackPromise(
            fetchData(url + searchText)
                .then(res => {
                    setPlanets(res);
                    // console.log("fetching into Planets, res : ", res);
                })
                .catch((error) => {
                    setError(error.message);
                    console.log("Error in fetching with button click")
                })
        );
        // console.log("going into hideComponent()");
        hideComponent("showSortButton");

    }

    //Comparer Function    
    function GetIntSortOrder(prop) {
        return function (a, b) {

            // console.log("ordering: ", a[prop], b[prop], a[prop] > b[prop], a[prop] > 9100, 11000 > b[prop]);
            if (parseInt(a[prop]) > parseInt(b[prop])) {
                return 1;
            } else if (parseInt(a[prop]) < parseInt(b[prop])) {
                return -1;
            }
            return 0;
        }
    }

    const sortButtonClick = () => {
        trackPromise(
            fetchData(url + searchText)
                .then(res => {
                    res.sort(GetIntSortOrder("diameter"));
                    setPlanets(res);

                    console.log("fetching into Planets, res : ", res, res[0]);

                })
                .catch((error) => {
                    setError(error.message);
                    console.log("Error in fetching with button click")
                })
        );
        // console.log("going into hideComponent()");
        hideComponent("showSortButton");

    }

    const showButtonClick2 = async () => {
        setPlanets([]); //empty the planets for new search
        // todo: to store in other and then paste
        // console.log(111, planets);

        // console.log(222, tempText);
        //todo: if searchField is null, do something with tempText
        // console.log(333, url + searchText);

        trackPromise(
            fetchPlanets(url + searchText).then((planets_) => {
                const planetList = [];
                planetList.push(planets_.results);
                console.log(444, planets_);

                let nextUrl = planets_.next;

                // while (nextUrl !== null) 
                {
                    fetchPlanets(nextUrl).then(res => {
                        console.log("here nextUrl: ", nextUrl);
                        planetList.push(res.results);
                        nextUrl = res.next;
                        console.log("planetList INN", planetList, "nextUrl: ", nextUrl);

                    });
                }
            })
        );
    };

    const hideComponent = (componentName) => {
        switch (componentName) {
            case "showSortButton":
                // console.log("hideComponent");
                setShowSortButton(true);
                break;
        }
    }


    return (
        <div className="container">
            <div className="header">
                <input
                    className="searchField"
                    placeholder="Search Planets"
                    onChange={(event) => setSearchText(event.target.value)}
                />
                <button className="showButton" onClick={showButtonClick}>
                    Show
                </button>
                {showSortButton && (<button className="sortButton" onClick={sortButtonClick}>
                    Sort
                </button>)}
                {/* {showSortButton && (<button className="showCircleButton" onClick={showCirclesOnClick}>
                    Show Circles
                </button>)} */}

            </div>
            {/* <center><h1>A user searching:</h1></center> */}
            {/* <p>{searchText}</p> */}
            <LoadingIndicator />
            {showSortButton && (<div>
                {planets.length >= 1 ? (
                    <>
                        <Pagination className="paginationSuperClass" planets={planets} RenderComponentCard={Card} RenderComponentCircles={CircleCard} pageTitle="Planet Lists" pageLimit={5} cardPerPage={10} />
                    </>
                ) : (
                    <h1>No Fetched Planets</h1>
                )}

            </div>)}
            {/* <div>
                <Circle_d3 />
            </div> */}

        </div >
    );
};

export default App;
