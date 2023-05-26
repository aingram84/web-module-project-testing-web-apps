import React from 'react';
import { queryByAltText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />);
});

test('renders the contact form header', () => {
    render(<ContactForm />);
    const formHeader = screen.getByText(/contact form/i);
    expect(formHeader).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameInput, 'Four');
    const nameError = await screen.findAllByTestId("error");
    expect(nameError).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId('error');
        expect(errorMessage).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const emailInput = screen.getByLabelText(/Email*/i);
    userEvent.type(firstNameInput, 'Fiveo');
    userEvent.type(lastNameInput, 'Hawaii');
    userEvent.type(emailInput, '');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    await waitFor(() => {
        const errorMessage = screen.queryAllByTestId('error');
        expect(errorMessage).toHaveLength(1);
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/Email*/i);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(firstNameInput, 'Fiveo');
    userEvent.type(lastNameInput, 'Hawaii');
    userEvent.type(emailInput, 'notaproperemail');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameInput, '');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/Email*/i);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    userEvent.type(firstNameInput, 'Fiveo');
    userEvent.type(lastNameInput, 'Hawaii');
    userEvent.type(emailInput, 'email@email.com');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);


    await waitFor(() => {
        const firstNameValue = screen.queryByText('Fiveo');
        const lastNameValue = screen.queryByText('Hawaii');
        const emailValue = screen.queryByText('email@email.com');
        const messageDisplay = screen.queryByTestId('MessageDisplay');
        expect(firstNameValue).toBeInTheDocument();
        expect(lastNameValue).toBeInTheDocument();
        expect(emailValue).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    const emailInput = screen.getByLabelText(/Email*/i);
    const firstNameInput = screen.getByLabelText(/First Name*/i);
    const lastNameInput = screen.getByLabelText(/Last Name*/i);
    const messageInput = screen.getByLabelText(/Message/i);
    userEvent.type(firstNameInput, 'Fiveo');
    userEvent.type(lastNameInput, 'Hawaii');
    userEvent.type(emailInput, 'email@email.com');
    userEvent.type(messageInput, 'I am words');
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);


    await waitFor(() => {
        const firstNameValue = screen.queryByText('Fiveo');
        const lastNameValue = screen.queryByText('Hawaii');
        const emailValue = screen.queryByText('email@email.com');
        const messageValue = screen.queryByText('I am words');
        expect(firstNameValue).toBeInTheDocument();
        expect(lastNameValue).toBeInTheDocument();
        expect(emailValue).toBeInTheDocument();
        expect(messageValue).toBeInTheDocument();
    });

});
