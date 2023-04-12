import Editor from "@monaco-editor/react";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Form, Formik } from "formik";
import { RootState } from "lib/store/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isBlank } from "utils/CodeEditorUtils";
import {
  CodeEditorFields,
  updateCodeEditor,
  validateCode,
} from "components/ProblemEditor/problemEditorContainerSlice";
import { useCheckboxContext } from "components/CheckboxContext";


interface Props {
  formRef: any;
}

interface FlattenedCodeFields {
  fileExtension: string;
  cppHeader: string;
  cppBody: string;
  cppFooter: string;
  pyHeader: string;
  pyBody: string;
  pyFooter: string;
  javaHeader: string;
  javaBody: string;
  javaFooter: string;
}

interface Errors {
  fileExtension?: string;
  cppHeader?: string;
  cppBody?: string;
  cppFooter?: string;
  pyHeader?: string;
  pyBody?: string;
  pyFooter?: string;
  javaHeader?: string;
  javaBody?: string;
  javaFooter?: string;
}

const defaultCppHeader = `//If students import packages or use namespaces on their own, it shouldn't cause problems
#include <iostream>
#include <vector>
using namespace std;
`;

const defaultCppBody = `int addTwoNums(int x, int y) {
	// Your code here
}
`;

const defaultCppFooter = `// The main does not have to be in the footer.
// The main should remain in the footer if you don't want students to be able to see it nor change it.
int main()
{
    int x = 0, y = 0;
    cin >> x >> y;
    int result = addTwoNums(x, y);
    // You should print out whatever the expected output should be. 
    // Be careful about whitespace. Ex: only put endl if you add an endline in your expected output.
    cout << result;
    return 0;
}
`;

const defaultPyHeader = `# If students import packages or use namespaces on their own, it shouldn't cause problems
import sys
import math
import numpy as np
import pandas as pd
`;

const defaultPyBody = `def addTwoNums(x, y):
# Your code here
pass
`;

const defaultPyFooter = `# The main does not have to be in the footer.
# The main should remain in the footer if you don't want students to be able to see it nor change it.
if __name__ == '__main__':
    x, y = map(int, input().split())
    result = addTwoNums(x, y)
    # You should print out whatever the expected output should be.
    # Be careful about whitespace. Ex: only put end='' if you don't want to end the line.
    print(result)
`;

const defaultJavaHeader = `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;
`;

const defaultJavaBody = `public class Main {
  public static void main(String[] args) {
      Scanner input = new Scanner(System.in);
      int x = input.nextInt();
      int y = input.nextInt();
      int result = addTwoNums(x, y);
      System.out.println(result);
      input.close();
  }

  public static int addTwoNums(int x, int y) {
      // Your code here
  }
}
`;

const defaultJavaFooter = `
`;


export const CodeEditorForm = ({ formRef }: Props) => {
  const dispatch = useDispatch();
  const { cpp, py, java } = useCheckboxContext();

  const [touched, setTouched] = React.useState(false);

  const initialValues = useSelector((state: RootState) => {
    const formattedFields: CodeEditorFields =
      state.problemEditorContainer.codeEditor;
    const fileExtension = formattedFields.fileExtension;
    const code = formattedFields.code;
    const flattenedFields: FlattenedCodeFields = {
      fileExtension,
      ...code,
    };
    return flattenedFields;
  });

  if (
    !touched &&
    isBlank(initialValues.cppHeader) &&
    isBlank(initialValues.cppBody) &&
    isBlank(initialValues.cppFooter) &&
    isBlank(initialValues.pyHeader) &&
    isBlank(initialValues.pyBody) &&
    isBlank(initialValues.pyFooter) &&
    isBlank(initialValues.javaHeader) &&
    isBlank(initialValues.javaBody) &&
    isBlank(initialValues.javaFooter)
  ) {
    initialValues.cppHeader = defaultCppHeader;
    initialValues.cppBody = defaultCppBody;
    initialValues.cppFooter = defaultCppFooter;
    initialValues.pyHeader = defaultPyHeader;
    initialValues.pyBody = defaultPyBody;
    initialValues.pyFooter = defaultPyFooter;
    initialValues.javaHeader = defaultJavaHeader;
    initialValues.javaBody = defaultJavaBody;
    initialValues.javaFooter = defaultJavaFooter;
  }

  const validation = (values: FlattenedCodeFields) => {
    const errors: Errors = {};
    dispatch(validateCode(Object.entries(errors).length === 0));
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        const formattedFields: CodeEditorFields = {
          fileExtension: values.fileExtension,
          code: {
            cppHeader: values.cppHeader,
            cppBody: values.cppBody,
            cppFooter: values.cppFooter,
            pyHeader: values.pyHeader,
            pyBody: values.pyBody,
            pyFooter: values.pyFooter,
            javaHeader: values.javaHeader,
            javaBody: values.javaBody,
            javaFooter: values.javaFooter,
          },
        };
        dispatch(updateCodeEditor(formattedFields));
      }}
      innerRef={formRef}
      validate={validation}
    >
      {({
        errors,
        values,
        handleChange,
        handleBlur,
        touched,
        setFieldValue,
      }) => (
        
        <Form>
          {cpp && (
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>C++ Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                  <br/>
                  <Stack overflow="none" spacing={5}>
                  <Box>
                    <FormControl>
                      <InputLabel>Codebox file extension</InputLabel>
                      <Select
                        name="fileExtension"
                        value={values.fileExtension}
                        label="fileExtension"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ minWidth: "10rem" }}
                        variant="filled"
                      >
                        <MenuItem value=".h">.h</MenuItem>
                        <MenuItem value=".cpp">.cpp</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <InputLabel>Header</InputLabel>
                    <FormHelperText>
                      This code precedes the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="cpp"
                        height="250px"
                        value={values.cppHeader}
                        onChange={(value) => {
                          setFieldValue("header", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box>
                    <InputLabel>Body</InputLabel>
                    <FormHelperText>This code is visible to students.</FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="cpp"
                        height="250px"
                        value={values.cppBody}
                        onChange={(value) => {
                          setFieldValue("body", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box flexGrow={1} display="flex" flexDirection="column">
                    <InputLabel>Footer</InputLabel>
                    <FormHelperText>
                      This code follows the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="cpp"
                        height="250px"
                        value={values.cppFooter}
                        onChange={(value) => {
                          setFieldValue("footer", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          {py && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Python Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <br/>
                  <Stack overflow="none" spacing={5}>
                  <Box>
                    <FormControl>
                      <InputLabel>Codebox file extension</InputLabel>
                      <Select
                        name="fileExtension"
                        value={values.fileExtension}
                        label="fileExtension"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ minWidth: "10rem" }}
                        variant="filled"
                      >
                        <MenuItem value=".py">.py</MenuItem>
                        
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <InputLabel>Header</InputLabel>
                    <FormHelperText>
                      This code precedes the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="python"
                        height="250px"
                        value={values.pyHeader}
                        onChange={(value) => {
                          setFieldValue("header", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box>
                    <InputLabel>Body</InputLabel>
                    <FormHelperText>This code is visible to students.</FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="python"
                        height="250px"
                        value={values.pyBody}
                        onChange={(value) => {
                          setFieldValue("body", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box flexGrow={1} display="flex" flexDirection="column">
                    <InputLabel>Footer</InputLabel>
                    <FormHelperText>
                      This code follows the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="python"
                        height="250px"
                        value={values.pyFooter}
                        onChange={(value) => {
                          setFieldValue("footer", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
          
          {java && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Java Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <br/>
                  <Stack overflow="none" spacing={5}>
                  <Box>
                    <FormControl>
                      <InputLabel>Codebox file extension</InputLabel>
                      <Select
                        name="fileExtension"
                        value={values.fileExtension}
                        label="fileExtension"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ minWidth: "10rem" }}
                        variant="filled"
                      >
                        <MenuItem value=".java">.java</MenuItem>
                        
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <InputLabel>Header</InputLabel>
                    <FormHelperText>
                      This code precedes the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="java"
                        height="250px"
                        value={values.javaHeader}
                        onChange={(value) => {
                          setFieldValue("header", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box>
                    <InputLabel>Body</InputLabel>
                    <FormHelperText>This code is visible to students.</FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="java"
                        height="250px"
                        value={values.javaBody}
                        onChange={(value) => {
                          setFieldValue("body", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                  <Box flexGrow={1} display="flex" flexDirection="column">
                    <InputLabel>Footer</InputLabel>
                    <FormHelperText>
                      This code follows the body and is not visible to students.
                    </FormHelperText>
                    <Paper
                      elevation={0}
                      variant="outlined"
                      sx={{ marginTop: 1, paddingTop: 1 }}
                    >
                      <Editor
                        language="java"
                        height="250px"
                        value={values.javaFooter}
                        onChange={(value) => {
                          setFieldValue("footer", value);
                          setTouched(true);
                        }}
                      />
                    </Paper>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}
          

        </Form>
      )}
    </Formik>
  );
};
