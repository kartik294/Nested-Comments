import "./App.css";
import commentsData from "./data/comments.json";
import NestedComments from "./ts-components/nested-comments";

const App = () => {
  return (
    <div>
      <h1>Nested Comment System</h1>
      <NestedComments
        comments={commentsData}
        onSubmit={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onUpvote={() => {}}
        onDownvote={() => {}}
      />
    </div>
  );
};

export default App;
