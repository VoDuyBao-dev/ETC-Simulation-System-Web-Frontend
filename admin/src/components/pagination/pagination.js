import React, {useState} from "react";
import styles from "./pagination.module.scss";

const Pagination = () => {
    const [list] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 3;

    const totalPages = Math.ceil(list.length / perPage);
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className={styles["pagination"]}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
            &laquo; Trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
            <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
            >
                {index + 1}
            </button>
            ))}

            <button onClick={handleNext} disabled={currentPage === totalPages}>
            Sau &raquo;
            </button>
        </div>
    )
}

export default Pagination;