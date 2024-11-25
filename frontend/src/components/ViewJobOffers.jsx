import React, { useState } from 'react';
import '../App.css';  // Importa il file CSS

// Mock data for job offers
const jobOffersData = [
    {
        id: 1,
        name: 'Software Developer',
        location: 'Rome',
        contractType: 'Full Time',
        duration: '6 months',
        workMode: 'Hybrid',
        value: 3000,
        status: 'Created',
        creationTime: '2024-11-01T12:00:00',
    },
    {
        id: 2,
        name: 'Project Manager',
        location: 'Milan',
        contractType: 'Part Time',
        duration: '1 year',
        workMode: 'In Presence',
        value: 2000,
        status: 'Selection Phase',
        creationTime: '2024-10-15T10:00:00',
    },
    {
        id: 3,
        name: 'Data Scientist',
        location: 'Florence',
        contractType: 'Full Time',
        duration: 'Permanent',
        workMode: 'Smart',
        value: 3500,
        status: 'Candidate Proposal',
        creationTime: '2024-09-30T09:00:00',
    },
    // More job offers can be added here
];

const ViewJobOffers = () => {
    const [jobOffers, setJobOffers] = useState(jobOffersData);
    const [sortBy, setSortBy] = useState('name');
    const [filter, setFilter] = useState({
        location: '',
        contractType: '',
        workMode: '',
    });

    // Sorting function
    const sortJobOffers = (offers, sortBy) => {
        return [...offers].sort((a, b) => {
            if (sortBy === 'value' || sortBy === 'duration') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else if (sortBy === 'creationTime') {
                return new Date(a[sortBy]) - new Date(b[sortBy]);
            } else {
                return a[sortBy].localeCompare(b[sortBy]);
            }
        });
    };

    // Filter job offers based on the selected filters
    const filteredJobOffers = jobOffers.filter((offer) => {
        return (
            (filter.location ? offer.location.includes(filter.location) : true) &&
            (filter.contractType ? offer.contractType.includes(filter.contractType) : true) &&
            (filter.workMode ? offer.workMode.includes(filter.workMode) : true)
        );
    });

    // Sorted job offers
    const sortedJobOffers = sortJobOffers(filteredJobOffers, sortBy);

    // Display 5 offers at a time
    const displayedOffers = sortedJobOffers.slice(0, 5);

    return (
        <div style={{ display: 'flex', paddingTop: '90px' }}>
            {/* Sidebar for filters */}
            <div style={{ width: '250px', padding: '20px', borderRight: '1px solid #ccc' }}>
                <h3>Filters</h3>
                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        value={filter.location}
                        onChange={(e) => setFilter({ ...filter, location: e.target.value })}
                    />
                </div>
                <div>
                    <label>Contract Type</label>
                    <input
                        type="text"
                        value={filter.contractType}
                        onChange={(e) => setFilter({ ...filter, contractType: e.target.value })}
                    />
                </div>
                <div>
                    <label>Work Mode</label>
                    <input
                        type="text"
                        value={filter.workMode}
                        onChange={(e) => setFilter({ ...filter, workMode: e.target.value })}
                    />
                </div>
            </div>

            {/* Main Content - Job Offers */}
            <div style={{ flex: 1, padding: '20px' }}>
                <h2>Job Offers</h2>

                {/* Sorting Options */}
                <div className="sortingContainer">
                    <label>Sort by:</label>
                    <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="sortingSelect">
                        <option value="name">Name</option>
                        <option value="value">Value</option>
                        <option value="duration">Duration</option>
                        <option value="creationTime">Creation Time</option>
                    </select>
                </div>

                {/* Job Offer Boxes */}
                <div className="offersContainer">
                    {displayedOffers.map((offer) => (
                        <div key={offer.id} className="offerBox">
                            <h3 className="offerTitle">{offer.name}</h3>
                            <div className="offerDetails">
                                <div><strong>Location:</strong> {offer.location}</div>
                                <div><strong>Contract Type:</strong> {offer.contractType}</div>
                                <div><strong>Duration:</strong> {offer.duration}</div>
                                <div><strong>Work Mode:</strong> {offer.workMode}</div>
                                <div><strong>Value:</strong> €{offer.value}</div>
                                <div><strong>Status:</strong> {offer.status}</div>
                                <div><strong>Creation Time:</strong> {new Date(offer.creationTime).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewJobOffers;
