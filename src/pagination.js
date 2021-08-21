import "./styles.css";

import { getNodeText } from "@testing-library/react";
import { useState } from "react"

//pageLimit is no of pages down in pagination at a time
export const Pagination = ({ planets, RenderComponentCard, RenderComponentCircles, pageTitle, pageLimit, cardPerPage }) => {
    const [pages] = useState(Math.round(planets.length / cardPerPage));
    const [currPage, setCurrPage] = useState(1);    //one Indexing

    function goToNextPage() {
        setCurrPage(page => page + 1);
    }

    function goToPreviousPage() {
        setCurrPage(page => page - 1);
    }

    function changeToPage(event) {
        const pageNumber = Number(event.target.textContent);
        setCurrPage(pageNumber);
    }

    const getCurrPageData = () => {
        const startIndex = currPage * pageLimit - pageLimit;
        const endIndex = startIndex + pageLimit;
        return planets.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
        // const a = new Array(pageLimit);
        // let j = Math.floor((currPage - 1) / pageLimit) * pageLimit;
        // for (let i = 0; i < a.length; i++) {
        //     a[i] = j++;
        // }
        let start = Math.floor((currPage - 1) / pageLimit) * pageLimit;
        return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <div>
            <h1>{pageTitle}</h1>
            <div className="cardContainer">
                {getCurrPageData().map((d, idx) => (
                    <RenderComponentCard key={idx} data={d} />
                ))}
            </div>

            <div className="paginationClass">

                {/* prev button */}
                <button onClick={goToPreviousPage} className={`prev ${currPage === 1 ? `disabled` : ''}`}>prev</button>

                {/* show page numbers */}
                {getPaginationGroup().map((item, index) => (
                    <button key={index} onClick={changeToPage} className={`paginationItem ${currPage === item ? 'active' : null}`}>
                        <span>{item}</span>
                    </button>
                ))}

                {/* next button */}
                <button onClick={goToNextPage} className={`next ${currPage === pages ? `disabled` : ''}`}>next</button>

            </div>
            <div className="circleCardContainer">
                {getCurrPageData().map((d, idx) => (
                    <RenderComponentCircles key={idx} data={d} />
                ))}
            </div>


        </div>
    );
}