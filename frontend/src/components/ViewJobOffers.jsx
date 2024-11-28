import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import '../App.css';  // Importa il file CSS
import Button from 'react-bootstrap/Button';

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
    {
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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
        id: 8,
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
        id: 9,
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
        id: 10,
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
        id: 11,
        name: 'Software Developer',
        location: 'Rome',
        contractType: 'Full Time',
        duration: '6 months',
        workMode: 'Hybrid',
        value: 3000,
        status: 'Created',
        creationTime: '2024-11-01T12:00:00',
    }
    // More job offers can be added here
];

const ViewJobOffers = () => {
    const [jobOffers, setJobOffers] = useState(jobOffersData);
    const [sortBy, setSortBy] = useState('name');
    const [filter, setFilter] = useState({
        location: '',
        contractType: '',
        workMode: '',
        status: '',
        value: '',
        duration:''

    });

    const [tempFilter, setTempFilter] = useState({ ...filter });

    // Gestione dei filtri temporanei
    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilter({ ...tempFilter, [name]: value });
    };

    // Applica i filtri
    const applyFilters = () => {
        setFilter({ ...tempFilter });
    };

    // Resetta i filtri
    const clearFilters = () => {
        setFilter({ location: '', contractType: '', workMode: '', status: '' });
        setTempFilter({ location: '', contractType: '', workMode: '', status: '' });
    };

    // Filtraggio delle offerte di lavoro
    const filteredJobOffers = jobOffers.filter((offer) => {
        return (
            (filter.location ? offer.location.includes(filter.location) : true) &&
            (filter.contractType ? offer.contractType.includes(filter.contractType) : true) &&
            (filter.workMode ? offer.workMode.includes(filter.workMode) : true) &&
            (filter.status ? offer.status.includes(filter.status) : true) &&
            (filter.value ? offer.value.includes(filter.value) : true) &&
            (filter.duration ? offer.duration.includes(filter.duration) : true)
        );
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


    // Sorted job offers
    const sortedJobOffers = sortJobOffers(filteredJobOffers, sortBy);


    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;


    const offset = currentPage * itemsPerPage;
    const currentJobOffers = sortedJobOffers.slice(offset, offset + itemsPerPage);

    // Funzione per cambiare pagina
    const changePage = (direction) => {
        if (direction === "next" && (currentPage + 1) * itemsPerPage < filteredJobOffers.length) {
            setCurrentPage(currentPage + 1);
        } else if (direction === "prev" && currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div style={{display: 'flex', paddingTop: '90px'}}>
            {/* Sidebar for filters */}
            <div style={{width: '30%', padding: '20px'}} className="filterBox">
                <h4 className={"offerTitle"}>Filters</h4>
                <Form.Group controlId="filterLocation" className="mb-3">
                    <Form.Label>Filter by Location</Form.Label>
                    <Form.Control
                        type="text"
                        name="location"
                        placeholder="Enter Location"
                        value={tempFilter.location}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterContractType" className="mb-3">
                    <Form.Label>Filter by Contract type</Form.Label>
                    <Form.Control
                        type="text"
                        name="contractType"
                        placeholder="Enter Contract Type"
                        value={tempFilter.contractType}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterWorkMode" className="mb-3">
                    <Form.Label>Filter by work mode</Form.Label>
                    <Form.Control
                        type="text"
                        name="workMode"
                        placeholder="Enter Work Mode"
                        value={tempFilter.workMode}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterStatus" className="mb-3">
                    <Form.Label>Filter by status</Form.Label>
                    <Form.Control
                        type="text"
                        name="status"
                        placeholder="Enter Status"
                        value={tempFilter.status}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterValue" className="mb-3">
                    <Form.Label>Filter by value</Form.Label>
                    <Form.Control
                        type="text"
                        name="value"
                        placeholder="Enter Value"
                        value={tempFilter.value}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Form.Group controlId="filterDuration" className="mb-3">
                    <Form.Label>Filter by duration</Form.Label>
                    <Form.Control
                        type="text"
                        name="duration"
                        placeholder="Enter Duration"
                        value={tempFilter.duration}
                        onChange={handleTempFilterChange}
                    />
                </Form.Group>
                <Button variant="secondary" className="me-2 custom-button" onClick={applyFilters} >
                    <i class="bi bi-search"></i>  Apply Filters
                </Button>
                <Button variant="secondary" onClick={clearFilters}>
                    <i class="bi bi-x-circle"></i>  Clear Filters
                </Button>
            </div>

            {/* Main Content - Job Offers */}
            <div style={{flex: 1, padding: '20px'}}>
                <h2>Job Offers</h2>
                <Button variant="secondary" className="float-end custom-button">
                    <i className="bi bi-plus-circle"></i> Add new job offer
                </Button>

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
                    {currentJobOffers.map((offer) => (
                        <div key={offer.id} className="offerBox">
                            <h3 className="offerTitle">{offer.name}</h3>
                            <div className="offerDetails">
                                <div><strong>Location:</strong> {offer.location}</div>
                                <div><strong>Contract Type:</strong> {offer.contractType}</div>
                                <div><strong>Duration:</strong> {offer.duration}</div>
                                <div><strong>Work Mode:</strong> {offer.workMode}</div>
                                <div><strong>Value:</strong> €{offer.value}</div>
                                <div><strong>Status:</strong> {offer.status}</div>
                                <div><strong>Creation Time:</strong> {new Date(offer.creationTime).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("prev")}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </Button>
                    <span>Page {currentPage + 1} of {Math.ceil(filteredJobOffers.length / itemsPerPage)}</span>
                    <Button
                        variant="outline-secondary"
                        onClick={() => changePage("next")}
                        disabled={(currentPage + 1) * itemsPerPage >= filteredJobOffers.length}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewJobOffers;
