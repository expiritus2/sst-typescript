import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API, Auth } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default function Home() {
    const [notes, setNotes] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const notes = await loadNotes();
                setNotes(notes || []);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);

            const user = await Auth.currentUserPoolUser();
            console.log(user);
        }

        onLoad();
    }, [isAuthenticated]);

    async function loadNotes() {
        // @ts-ignore
        return API.get("notes", "/notes", {});
    }

    const getNotes = () => {
        return notes.map((note) => {
            const { noteId, content, createdAt } = note;
            return (
                <LinkContainer key={noteId} to={`/notes/${noteId}`}>
                    <ListGroup.Item action>
            <span className="font-weight-bold">
              {(content as string).trim().split("\n")[0]}
            </span>
                        <br/>
                        <span className="text-muted">
              Created: {new Date(createdAt).toLocaleString()}
            </span>
                    </ListGroup.Item>
                </LinkContainer>
            )
        })
    }

    function renderNotesList(notes: any) {
        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17}/>
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                {getNotes()}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p className="text-muted">A simple note taking app</p>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}