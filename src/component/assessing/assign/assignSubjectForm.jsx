import * as React from "react";
import FirebaseContext from '../../firebase/context';
import Select from 'react-select';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

const AssignSubjectForm = () => {

    const firebase = React.useContext(FirebaseContext);

    const [assessors, setAssessors] = React.useState([]);
    const [selectedAssessor, setSelectedAssessor] = React.useState();
    const [subjects, setSubjects] = React.useState([]);;
    const [selectedSubjects, setSelectedSubjects] = React.useState([]);

    

    //On mount
    React.useEffect(() => {
        const onMount = async () => {
            setAssessors(await firebase.findByRole("assessor"));
            let subjectRefs = await firebase.getViewableSubjectRefs();
            Promise.all(subjectRefs.map(subjectRef => subjectRef.get())).then(setSubjects);
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
        setSelectedSubjects(value);
    }

    const mapAssessors = () => {
        return assessors.map((assessor, i) => {
            return {
                value: i,
                document: assessor,
                label: assessor.data().firstName + " " + assessor.data().lastName,
            }
        });
    }

    const onSelectedAssessor = async (value) => {
        value.document.ref.get().then((result) => {
            const data = result.data();
            if (data.subjects) {
                Promise.all(data.subjects.map(async (subject, i) => {
                    const stuff = subjectToOption(await subject.get(), i);
                    return stuff;
                })).then((result) => setSelectedSubjects(result));
            } else {
                setSelectedSubjects([]);
            }
        });
        setSelectedAssessor(value);
    };

    const updateAssignment = () => {
        firebase.assignSubjects(selectedAssessor.document.ref, selectedSubjects.map((subject) => subject.document.ref));
    }

    return (
        <div>
            <Form.Group>
                <Form.Label>Assessor</Form.Label>
                <Select
                    options={mapAssessors()}
                    placeholder={"Select Assessor..."}
                    onChange={onSelectedAssessor}
                    value={selectedAssessor}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Subjects</Form.Label>
                <Select
                    options={mapSubjects()}
                    isDisabled={!selectedAssessor}
                    placeholder={"Select Subjects..."}
                    value={selectedSubjects}
                    onChange={onSelectedSubject}
                    isMulti
                />
            </Form.Group>
            <Form.Group>
                <Button onClick={updateAssignment}>
                    Update Assignment
                </Button>
            </Form.Group>
        </div>
    );

}

export default AssignSubjectForm;
