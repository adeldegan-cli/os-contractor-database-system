import React, { useContext, useEffect, useState, useMemo } from "react";
import { Footer, Navigation } from "../index";
import "./Search.css";
import { Button, Checkbox, Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { skillsContext } from "../../contexts/SkillsContext";
import { contractorContext } from "../../contexts/ContractorContext";
import CSCSelector from "./CSCSelector";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Avatar from "../../assets/avatar.png";

let q;
export default function Search() {
  const navigate = useNavigate();
  const { qualification } = useParams();
  const { skillsList } = useContext(skillsContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { contractorList } = useContext(contractorContext);
  const [contractors, setContractors] = useState([]);
  const [country, setCountry] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [city, setCity] = React.useState(null);
  const location = useLocation();
  const searchStateFromLocation = location.state?.searchState;

  const memoizedSearchState = useMemo(
    () => ({
      selectedOptions,
      country,
      state,
      city,
    }),
    [selectedOptions, country, state, city]
  );

  useEffect(() => {
    if (searchStateFromLocation) {
      setSelectedOptions(searchStateFromLocation.selectedOptions || []);
      setCountry(searchStateFromLocation.country || "");
      setState(searchStateFromLocation.state || "");
      setCity(searchStateFromLocation.city || "");
    } else {
      const savedState = JSON.parse(sessionStorage.getItem("searchState"));
      if (savedState) {
        setSelectedOptions(savedState.selectedOptions || []);
        setCountry(savedState.country || "");
        setState(savedState.state || "");
        setCity(savedState.city || "");
      }
    }
  }, [searchStateFromLocation]);

  const handleOptionChange = (optionId) => {
    const newSelectedOptions = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId];
    setSelectedOptions(newSelectedOptions);
  };

  useEffect(() => {
    const checkQualification = () => {
      if (qualification === "developers") {
        q = "Developer";
      } else if (qualification === "designers") {
        q = "Designer";
      } else if (qualification === "projectmanagers") {
        q = "Project Manager";
      } else if (qualification === "productmanagers") {
        q = "Product Manager";
      }
    };
    checkQualification();
  }, [qualification]);

  useEffect(() => {
    sessionStorage.setItem(
      "searchState",
      JSON.stringify({
        selectedOptions,
        country,
        state,
        city,
      })
    );
    const contractorSkillsList = () => {
      const filteredContractors = [];
      for (const contractor of contractorList) {
        let numMatchingSkills = 0;
        if (selectedOptions.length > 0) {
          for (const option of selectedOptions) {
            if (contractor?.skillIds?.includes(option)) {
              numMatchingSkills++;
            }
          }
        } else {
          // Show all contractors if no skills are selected
          numMatchingSkills = 1;
        }

        // Filter contractors by location (country, state, and city)
        const isMatchingLocation =
          (!country || contractor.countryCode === country) &&
          (!state || contractor.stateCode === state) &&
          (!city || contractor.city === city);

        // Filter contractors by qualification
        const whatQualification = contractor.qualification === q;

        const percentMatching = selectedOptions.length
          ? Math.round((numMatchingSkills / selectedOptions.length) * 100)
          : 100;

        if (numMatchingSkills > 0 && isMatchingLocation && whatQualification) {
          filteredContractors.push({
            ...contractor,
            percentMatching,
          });
        }
      }
      filteredContractors.sort((a, b) => {
        if (b.percentMatching === a.percentMatching) {
          return a.firstName.localeCompare(b.firstName);
        }
        return b.percentMatching - a.percentMatching;
      });
      setContractors(filteredContractors);
    };

    contractorSkillsList();
  }, [selectedOptions, contractorList, country, state, city]);

  const handleClearLocation = () => {
    setCountry(null);
    setState(null);
    setCity(null);
  };

  const handleClearSkill = () => {
    setSelectedOptions([]);
  };

  return (
    <div>
      <Navigation />
      <h1
        style={{
          textAlign: "center",
          backgroundColor: "#B2B2B2",
          padding: "3px",
        }}
      >
        Developers
      </h1>
      <div className="search_container">
        <div
          style={{
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: "0.5px",
            borderRadius: "5px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ textAlign: "center", margin: 0, marginBottom: "20px" }}>
            Search by Location
          </h2>

          <div className="search_location">
            <CSCSelector
              initialCountry={country}
              initialState={state}
              initialCity={city}
              getCountry={(country) => setCountry(country)}
              getState={(state) => setState(state)}
              getCity={(city) => setCity(city)}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleClearLocation} style={{width: "100px", height: "30px", cursor: "pointer", border: "none"}}>Clear location</button>
          </div>
        </div>
        <div
          style={{
            borderStyle: "solid",
            borderColor: "gray",
            borderWidth: "0.5px",
            borderRadius: "5px",
            padding: "20px",
          }}
        >
          <h2 className="search_title">Search by Skill</h2>
          <div>
            <Grid container spacing={10} minHeight={160}>
              <Grid
                xs
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                {skillsList.map((option) => (
                  <div className="search_options" key={option.id}>
                    <Checkbox
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionChange(option.id)}
                    />
                    {option.title}
                    <br />
                  </div>
                ))}
              </Grid>
            </Grid>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleClearSkill} style={{width: "100px", height: "30px", cursor: "pointer"}}>Clear skills</button>
          </div>
                     </div>
        </div>
        <Divider />
        <ul>
          {contractors.length === 0 ? (
            <div className="no-results-message">No results</div>
          ) : (
            contractors.map((contractor) => (
              <div
                className="contractor_container"
                key={contractor?.id}
                onClick={() => {
                  navigate(`/contractor/${contractor?.id}`, {
                    state: {
                      searchState: memoizedSearchState,
                    },
                  });
                }}
              >
                <div style={{ marginLeft: "5px" }}>
                  <div style={{ minWidth: "60px" }}>
                    <b>{contractor?.percentMatching}%</b>
                  </div>
                  {contractor?.profileImg ? (
                    <img
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                      src={contractor?.profileImg}
                      alt=""
                    />
                  ) : (
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: "1px",
                        borderRadius: "5px",
                      }}
                      src={Avatar}
                      alt="Avatar"
                    />
                  )}
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <div>
                    <b>{contractor?.firstName}&nbsp;</b>
                    <b>{contractor?.lastName}&nbsp;</b>
                    <div className="contractor_qualification2">
                      {contractor?.qualification}
                    </div>
                  </div>
                  <div>{contractor.summary}</div>
                  <div>
                    {contractor?.skillIds && (
                      <div style={{ display: "flex" }}>
                        {contractor?.skillIds.map((resultSkill) => {
                          const allSkills = skillsList?.filter(({ id }) =>
                            resultSkill.includes(id)
                          );
                          return (
                            <div key={resultSkill}>
                              {allSkills.map((r) => (
                                <Button
                                  key={r.id}
                                  style={{
                                    width: "auto",
                                    borderStyle: "solid",
                                    borderWidth: "1px",
                                    padding: "0.2px",
                                    marginTop: "5px",
                                    marginBottom: "5px",
                                    marginLeft: "5px",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {r.title}
                                </Button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
