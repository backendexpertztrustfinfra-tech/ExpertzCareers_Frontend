import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import candidateService from "../api/candidateService";

const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    candidateService.getCandidateById(id).then((data) => {
      setCandidate(data);
    });
  }, [id]);

  if (!candidate) return <p>Loading...</p>;

  return (
    <div className="candidate-detail">
      <h1>{candidate.name}</h1>
      <img
        src={candidate.photoUrl}
        alt={`${candidate.name}'s profile`}
        width="150"
      />
      <p>
        <strong>Email:</strong> {candidate.email}
      </p>
      <p>
        <strong>Phone:</strong> {candidate.phone}
      </p>
      <p>
        <strong>Skills:</strong> {candidate.skills.join(", ")}
      </p>
      <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
        Download Resume
      </a>

      {/* You can create subcomponents for experience, education, etc. */}
    </div>
  );
};

export default CandidateDetail;
