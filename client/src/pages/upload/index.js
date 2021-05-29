import { Input } from "reactstrap";
import { MUTATION } from "../../graphql/mutations";
import { useState } from "preact/hooks";
import { useMutation } from "@apollo/client";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const [mutate] = useMutation(MUTATION);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      mutate({
        variables: {
          file,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <h5>Upload</h5>
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <Input
            type="file"
            className="custom-file-input"
            id="customFile"
            onInput={onChange}
          />
          <br />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
    </div>
  );
};

export default FileUpload;
