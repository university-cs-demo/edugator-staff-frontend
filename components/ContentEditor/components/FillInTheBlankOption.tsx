import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    InputAdornment
} from "@mui/material";
import { Info } from "phosphor-react";
import React, { useState, useRef, useEffect } from "react";
import { MuiChipsInput } from "mui-chips-input";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import "./ExerciseStyles.module.css";
import { blankAnswer } from "./exportStructures";

export const FillInTheBlankModal = ({
    open,
    setOpen,
    insert,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    insert: (
        e: any,
        questionSegments: string[],
        correctAnswers: blankAnswer[],
    ) => void;
}) => {
    const toolTipMessage = "Press Enter to add possible answer choice(s).\n“Require exact match” toggles case-sensitivity and will not approximate decimals.";
    const exactMatchText = "Require exact match";
    // Unicode characters used to denote answer blanks when creating a FITB question.
    const blankAnswerPlaceholderChars = ['Ⓐ', 'Ⓑ', 'Ⓒ', 'Ⓓ']

    const [questionSegments, setQuestionSegments] = useState<string[]>([]);
    const [correctAnswers, setCorrectAnswers] = useState<blankAnswer[]>([]);
    const [blankAnswerPlaceholderIndex, setBlankAnswerPlaceholderIndex] = useState(0);
    const [isAddQuestionDisabled, setIsAddQuestionDisabled] = useState(true);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    const modalInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => console.log("Correct answers: ", correctAnswers), [correctAnswers]);
    useEffect(() => console.log("Question segments: ", questionSegments), [questionSegments]);
    useEffect(() => {
        updateAddQuestionButton(correctAnswers);
    }, [correctAnswers]);
    useEffect(() => {
        const input = modalInput.current;
        if (input) input.setSelectionRange(cursorPosition, cursorPosition); // Sets the cursor position to the value of cursorPosition when input is no longer focused.
    }, [modalInput, cursorPosition, questionSegments]);

    // Split string into string[] based on location of the placeholder characters (which are used as delimiters).
    const transformQuestionIntoSegments = (question: string) => {
        if (!blankAnswerPlaceholderChars.length) return [question];

        let regExpString = blankAnswerPlaceholderChars[0];
        blankAnswerPlaceholderChars.forEach((exp, i) => {
            regExpString += '|' + blankAnswerPlaceholderChars[i];
        })
        return question.split(new RegExp(regExpString));
    };

    const handleAnswerChoicesChange = (updatedChoices: string[], i: number) => {
        let updatedCorrectAnswers = [...correctAnswers];
        updatedCorrectAnswers[i].possibleChoices = updatedChoices;
        setCorrectAnswers(updatedCorrectAnswers);
    }

    const updateAddQuestionButton = (correctAnswers: blankAnswer[]) => {
        for (let i = 0; i < correctAnswers.length; i++) {
            if (correctAnswers[i].possibleChoices[0] === undefined) {
                setIsAddQuestionDisabled(true);
                break;
            } else { setIsAddQuestionDisabled(false); }
        }
    }

    const handleExactMatchCheckboxChange = (i: number) => {
        let updatedCorrectAnswers = [...correctAnswers];
        updatedCorrectAnswers[i].shouldHaveExactMatch = !updatedCorrectAnswers[i].shouldHaveExactMatch;
        setCorrectAnswers(updatedCorrectAnswers);
    }

    // Add a new blankAnswer object to correctAnswers[]
    const addNewBlankAnswer = () => {
        let updatedCorrectAnswers = [...correctAnswers];
        let newBlankAnswer = new blankAnswer([], false);
        updatedCorrectAnswers.push(newBlankAnswer);
        setCorrectAnswers(updatedCorrectAnswers);
    }

    const resetValues = () => {
        setQuestionSegments([]);
        setCorrectAnswers([]);
        setBlankAnswerPlaceholderIndex(0);
        setIsAddQuestionDisabled(true);
    };

    const onInsertBlankClick = () => {
        if (blankAnswerPlaceholderIndex < blankAnswerPlaceholderChars.length) {
            if (modalInput.current) {
                // Insert placeholder characters for question input at cursor position.
                let cursorPosition = modalInput.current.selectionStart;
                if ((cursorPosition !== null)) {
                    let textBeforeCursorPosition = modalInput.current.value.substring(0, cursorPosition);
                    let textAfterCursorPosition = modalInput.current.value.substring(cursorPosition, modalInput.current.value.length);
                    modalInput.current.value = textBeforeCursorPosition + blankAnswerPlaceholderChars[blankAnswerPlaceholderIndex] + textAfterCursorPosition;
                    console.log("Current question input: ", modalInput.current.value);
                    setQuestionSegments(transformQuestionIntoSegments(modalInput.current.value));
                    setBlankAnswerPlaceholderIndex(blankAnswerPlaceholderIndex + 1);
                    addNewBlankAnswer();
                    setCursorPosition(cursorPosition + 1); // Sets the cursorPosition to just after the inserted character.
                }
            }
        }
        else {
            // TODO:  user tries to insert more than 4 blanks - Will disable and style the button differently
        }
    };

    return (
        <Dialog open={open} aria-labelledby="alert-dialog-title" fullWidth={true}>
            <DialogTitle id="alert-dialog-title">
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Fill-in-the-Blank</h2>
                        </div>
                        <div className="modal-body">
                            <div className="modal-question">
                                <label htmlFor="question">Question</label>
                                <Button
                                    onClick={() => {
                                        onInsertBlankClick();
                                    }}
                                    variant="contained"
                                    color="primary"
                                    disabled={blankAnswerPlaceholderIndex > blankAnswerPlaceholderChars.length - 1}
                                >
                                    + Insert Blank
                                </Button>
                                <div>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        ref={modalInput}
                                        onChange={(e) => {
                                            setQuestionSegments(transformQuestionIntoSegments(e.target.value));
                                            setCursorPosition(e.target.selectionStart);
                                            // TODO: Need to deal with deleting blanks
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-answers">
                                <label htmlFor="answers">Answers</label>
                                <Tooltip
                                    title={<div style={{ whiteSpace: 'pre-line', textAlign: 'center' }}>{toolTipMessage}</div>}
                                    arrow
                                >
                                    <Info size={32} />
                                </Tooltip>
                                {correctAnswers.map((correctAnswer, i) => (
                                    <Box key={i} sx={{ display: 'inline' }}>
                                        {blankAnswerPlaceholderChars[i]}
                                        <MuiChipsInput
                                            value={correctAnswer.possibleChoices}
                                            onChange={(e) => handleAnswerChoicesChange(e, i)}
                                        />
                                        <FormGroup>
                                            <FormControlLabel control={
                                                <Checkbox
                                                    checked={correctAnswer.shouldHaveExactMatch}
                                                    onChange={() => handleExactMatchCheckboxChange(i)}
                                                />
                                            }
                                                label={exactMatchText}
                                            />
                                        </FormGroup>
                                    </Box>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogTitle>
            <DialogActions>
                <Button
                    onClick={() => {
                        setOpen(false);
                        resetValues();
                    }}
                >
                    Close
                </Button>
                <Button
                    onClick={(e) => {
                        console.log("Print FITB Data:", questionSegments, correctAnswers);
                        insert(e, questionSegments, correctAnswers);
                        resetValues();
                        setOpen(false);
                    }}
                    variant="contained"
                    color="success"
                    disabled={isAddQuestionDisabled}
                >
                    Add Question
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FillInTheBlankModal;