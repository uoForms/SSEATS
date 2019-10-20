import * as React from "react";
import FirebaseContext from '../../firebase/context';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import "react-datepicker/dist/react-datepicker.css";


const ReviewForm = (props) => {

    const firebase = React.useContext(FirebaseContext);

    const [date, setDate] = React.useState();
    const [review, setReview] = React.useState();
    const [subjects, setSubjects] = React.useState([]);
    const [selectedSubject, setSelectedSubject] = React.useState();

    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    
    React.useEffect(() => {
        const onMount = async () => {
            setSubjects(await firebase.getSubjects());
        };
        onMount();
    }, [firebase]);

    React.useEffect(() => {
        if(props.review) {
            console.log(props.review)
            props.review.get().then((reviewDoc) => {
                console.log(reviewDoc)
                setDate(reviewDoc.data().date.toDate());
                setReview(reviewDoc.data().review);
            })
        } else {
            setDate(new Date());
            setSelectedSubject([]);
        }
    }, [props.review])

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
        setSelectedSubject(value);
    };

    const updateReview = (event) => {
        setReview(event.currentTarget.value);
    };

    const saveReview = () => {
        setError("");
        setMessage("");
        firebase.saveReview(props.review, review, date, selectedSubject ? selectedSubject.document.ref : null).then(() => {
            setMessage("The review has been saved");
        }).catch((e) => {
            setError(e.message);
        });
    };
      
    return (
        <div>
            {error ? <Alert variant={'danger'}>{error}</Alert> : null}
            {message ? <Alert variant={'success'}>{message}</Alert> : null}
            <Form.Group>
                <Form.Label>Review Date</Form.Label>
                <div>
                    <DatePicker
                        selected={date}
                        onChange={setDate}
                        className={"form-control"}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>
            </Form.Group>
            {!props.review ? (
                <Form.Group>
                    <Form.Label>Subject</Form.Label>
                    <Select
                        options={mapSubjects()}
                        placeholder={"Select a Subject..."}
                        value={selectedSubject}
                        onChange={onSelectedSubject}
                    />
                </Form.Group>
            ): null}
            
            <Form.Group>
                <Form.Label>Review</Form.Label>
                <Form.Control 
                    as="textarea"
                    value={review}
                    onChange={updateReview}
                    rows="4"
                />
            </Form.Group>
            <Form.Group>
                <Button onClick={saveReview}>
                    Save review
                </Button>
            </Form.Group>
        </div>

    );
};

export default ReviewForm;
