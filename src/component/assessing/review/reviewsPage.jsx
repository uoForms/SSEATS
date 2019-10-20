import * as React from "react";
import _ from "lodash";
import FirebaseContext from "../../firebase/context";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Select from 'react-select';
import List from "../../common/list/list";
import ReviewListItem from "./reviewListItem";
import ReviewForm from "./reviewForm";

const ReviewsPage = (props) => {

    const firebase = React.useContext(FirebaseContext);

    const [subjects, setSubjects] = React.useState([]);
    const [selectedSubject, setSelectedSubject] = React.useState();
    const [reviews, setReviews] = React.useState({});
    const [review, setReview] = React.useState();

    React.useEffect(() => {
        const onMount = async () => {
            setSubjects(await firebase.getSubjects());
        };
        onMount();
    }, [firebase]);

    const subjectToOption = (subject, index) => {
        return {
            value: index,
            document: subject,
            label: subject.data().name,
        };
    }

    const mapSubjects = () => {
        return subjects.map((subject, i) => {
            return subjectToOption(subject, i);
        });
    };

    const onSelectedSubject = (value, action) => {
        setReview();
        setSelectedSubject(value);
    };

    const fillReviews = async (subjectRef) => {
        const newReviews = _.clone(reviews);
        newReviews[subjectRef.path] = await firebase.getReviews(subjectRef);
        setReviews(newReviews);
    }

    const getReviews = (subject) => {
        if(!reviews[subject.document.ref.path]) {
            fillReviews(subject.document.ref);
            return [];
        } else {
            return Object.keys(reviews[subject.document.ref.path]).map((reviewId) => {
                let review = _.clone(reviews[subject.document.ref.path][reviewId]);
                review.onClick = () => {
                    setReview(subject.document.ref.collection("reviews").doc(reviewId));
                }
                return review;
            });
        }
    };

    const closeReview = async () => {
        const newReviews = _.clone(reviews);
        delete newReviews[selectedSubject.document.ref.path];
        setReviews(newReviews);
        setReview(null);
    }

    return (
        <div style={{ width: '90vw', maxWidth: '50rem', margin: '5rem auto'}}>
            <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Select
                    options={mapSubjects()}
                    placeholder={"Select a Subject..."}
                    value={selectedSubject}
                    onChange={onSelectedSubject}
                />
            </Form.Group>
            <Card>
                {selectedSubject ? (
                    review ? (
                        <Card.Body>
                            <Form.Group>
                                <Button
                                    variant="danger"
                                    onClick={closeReview}
                                >
                                    Close Review
                                </Button>
                            </Form.Group>
                            <ReviewForm
                                review={review}
                            />
                        </Card.Body>
                    ) : (
                        <React.Fragment>
                            {getReviews(selectedSubject).length ? (
                                <List
                                    type={"flush"}
                                    list={getReviews(selectedSubject)}
                                    template={ReviewListItem}
                                />

                            ): (
                                <Card.Body>
                                    <h4>No reviews for this subject</h4>
                                </Card.Body>
                            )}
                        </React.Fragment>
                    )
                ): (
                    <Card.Body>
                        <h4>Select a subject to view his reviews</h4>
                    </Card.Body>
                )}
                </Card>
        </div>
    );

};

export default ReviewsPage;
