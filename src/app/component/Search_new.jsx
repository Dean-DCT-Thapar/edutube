"use client";

import { useState } from "react";
import axios from "axios";
import SearchCard from "./SearchCard";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [advancedSearchVisible, setAdvancedSearchVisible] = useState(false);
  const [advancedFields, setAdvancedFields] = useState([{ keyword: "", value: "" }]);

  const handleSearch = async () => {
    if (!query.trim() && !advancedFields.some(field => field.value.trim())) return;
    setLoading(true);
    setSearchInitiated(true);
    try {
      const response = await axios.post(`/api/search`, {
        keyword: query,
        type: category,
        advancedFields,
      });
      setResults(response.data);
      console.log(advancedFields);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setAdvancedFields([...advancedFields, { keyword: "", value: "" }]);
  };

  const handleFieldChange = (index, field, value) => {
    const newFields = [...advancedFields];
    newFields[index][field] = value;
    setAdvancedFields(newFields);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div>
        <input
          type="text"
          placeholder="Type your query..."
          value={query}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            border: "1.5px solid #ece6f0",
            backgroundColor: "#ece6f0",
            padding: "10px",
            paddingLeft: "12px",
            marginLeft:"15%",
            color: "#49454f",
            width: "50%",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#9f352c",
            color: "white",
            cursor: "pointer",
          }}
        >
          Search
        </button>
        <button
          onClick={() => setAdvancedSearchVisible(!advancedSearchVisible)}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#9f352c",
            color: "white",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Advanced Search
        </button>
        <br />
        {searchInitiated ? <select
          style={{
            padding: "10px",
            marginRight: "10px",
            color: "#49454f",
            paddingLeft: "10px",
            backgroundColor: "#ece6f0",
            marginLeft:"15%",
            marginTop: "10px",
            border: "1.5px solid #ece6f0",
            color: "#000",
          }}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="">All</option>
          <option value="lectures">Lectures</option>
          <option value="courses">Courses</option>
          <option value="teachers">Teachers</option>
        </select> : null}
      </div>
      {advancedSearchVisible && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {advancedFields.map((field, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              {index > 0 && <h1 className="text-black mr-2 font-semibold" style={{ display: "inline" }}>AND</h1>}
              <select
                value={field.keyword}
                onChange={(e) => handleFieldChange(index, "keyword", e.target.value)}
                style={{
                  padding: "10px",
                  marginRight: "10px",
                  color: "#49454f",
                  paddingLeft: "10px",
                  backgroundColor: "#ece6f0",
                  border: "1.5px solid #ece6f0",
                  color: "#000",
                  marginLeft: index===0 ? "43px" : null,
                }}
              >
                <option value="keywords">Keyword</option>
                <option value="courses">Course</option>
                <option value="teachers">Teacher</option>
                <option value="title">Title</option>
              </select>
              <input
                required
                type="text"
                placeholder="Enter value..."
                value={field.value}
                onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                style={{
                  border: "1.5px solid #ece6f0",
                  backgroundColor: "#ece6f0",
                  padding: "10px",
                  paddingLeft: "12px",
                  color: "#49454f",
                  width: "50%",
                }}
              />
            </div>
          ))}
          <button
            onClick={handleAddField}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#9f352c",
              color: "white",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Add More Fields
          </button>
        </div>
      )}
      {loading ? (
        <p style={{ color: "#000000", marginLeft: "25%" }}>Loading...</p>
      ) : searchInitiated && results.length === 0 ? (
        <p style={{ color: "#000000", marginLeft: "25%" }}>No results found</p>
      ) : (
        <ul style={{ marginTop: "20px" }}>
          {category === "lectures" &&
            results.filter((result) => result.type === "lecture").length ===
              0 && (
              <p style={{ color: "#000000", marginLeft: "25%" }}>
                No lectures found
              </p>
            )}
          {category === "courses" &&
            results.filter((result) => result.type === "course").length ===
              0 && (
              <p style={{ color: "#000000", marginLeft: "25%" }}>
                No courses found
              </p>
            )}
          {category === "teachers" &&
            results.filter((result) => result.type === "teacher").length ===
              0 && (
              <p style={{ color: "#000000", marginLeft: "25%" }}>
                No teachers found
              </p>
            )}
          {results.map((result, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {category === "" && (
                <>
                  {result.type === "lecture" && (
                    <div>
                      <Link
                        href={
                          "/course_page/" +
                          result.teacher_id +
                          "?chapter=" +
                          result.chapter_number +
                          "&lecture=" +
                          result.lecture_number
                        }
                      >
                        <SearchCard
                          main_title={result.lecture_title}
                          subtitle1={result.course_name}
                          subtitle2={result.teacher_name}
                          type="lecture"
                          subtitle3="lecture"
                        />
                      </Link>
                    </div>
                  )}
                  {result.type === "course" && (
                    <Link
                      href={
                        "/course_page/" +
                        result.teacher_id +
                        "?chapter=1&lecture=1"
                      }
                    >
                      <div>
                        <SearchCard
                          main_title={result.course_name}
                          subtitle1={"by " + result.teacher_name}
                          type="course"
                          subtitle3="course"
                        />
                      </div>
                    </Link>
                  )}
                  {result.type === "teacher" && (
                    <div>
                      <SearchCard
                        main_title={result.teacher_name}
                        type="teacher"
                        subtitle3="teacher"
                      />
                    </div>
                  )}
                </>
              )}
              {category === "lectures" && result.type === "lecture" && (
                <Link
                  href={
                    "/course_page/" +
                    result.teacher_id +
                    "?chapter=" +
                    result.chapter_number +
                    "&lecture=" +
                    result.lecture_number
                  }
                >
                  <SearchCard
                    main_title={result.lecture_title}
                    subtitle1={result.course_name}
                    subtitle2={result.teacher_name}
                  />
                </Link>
              )}
              {category === "courses" && result.type === "course" && (
                <Link
                  href={
                    "/course_page/" +
                    result.teacher_id +
                    "?chapter=1&lecture=1"
                  }
                >
                  <SearchCard
                    main_title={result.course_name}
                    subtitle1={result.teacher_name}
                    type="course"
                  />
                </Link>
              )}
              {category === "teachers" && result.type === "teacher" && (
                <SearchCard main_title={result.teacher_name} type="teacher" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}