import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import moment from 'moment'
export default class Listing extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            activePage: 1,
            itemsCountPerPage: 1,
            totalItemsCount: 1,
            pageRangeDisplayed: 3,
            alert_message: ''
        }
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    UNSAFE_componentWillMount() {
        axios.get('http://127.0.0.1:8000/api/post')
            .then(response => {
                this.setState({
                    posts: response.data.data,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total,
                    activePage: response.data.current_page
                });
            });
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        axios.get('http://127.0.0.1:8000/api/post?page=' + pageNumber)
            .then(response => {
                this.setState({
                    posts: response.data.data,
                    itemsCountPerPage: response.data.per_page,
                    totalItemsCount: response.data.total,
                    activePage: response.data.current_page
                });
            });
    }

    onDelete(post_id) {
        axios.delete('http://127.0.0.1:8000/api/post/delete/' + post_id)
            .then(response => {

                var posts = this.state.posts;
                console.log(posts.length)
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].id == post_id) {
                        posts.splice(i, 1);
                        this.setState({ posts: posts });
                    }
                }
                this.setState({ alert_message: "success" })
            }).catch(error => {
                this.setState({ alert_message: "error" });
            })

    }

    render() {
        return (
            <div>
                <hr />

                {this.state.alert_message == "success" ? <SuccessAlert message={"Post deleted successfully."} /> : null}
                {this.state.alert_message == "error" ? <ErrorAlert message={"Error occured while deleting the post."} /> : null}

                <table className="table table-sm table-striped small">
                    <thead>
                        <tr>
                            <th scope="col" width="15%">Title</th>
                            <th scope="col" width="55%">Description</th>
                            <th scope="col" width="8">Status</th>
                            <th scope="col">Created At</th>
                            <th scope="col">Updated At</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.posts.map(post => {
                                return (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.description}</td>
                                        <td>{post.active == 1 ? ("Active") : ("InActive")}</td>
                                        <td>{moment(post.created_at, 'YYYYMMDD').fromNow()}</td>
                                        <td>{post.updated_at}</td>
                                        <td>
                                            <Link to={`/post/edit/${post.id}`}>Edit</Link> |
                                            <a href="#" onClick={this.onDelete.bind(this, post.id)}>Delete</a>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>


                <div className="d-flex justify-content-center">
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={this.state.pageRangeDisplayed}
                        onChange={this.handlePageChange}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
            </div>
        );
    }
}
