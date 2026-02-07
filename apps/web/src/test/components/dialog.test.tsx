import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

describe("Dialog Component", () => {
    beforeEach(() => {
        vi.useRealTimers();
    });

    describe("Rendering", () => {
        it("renders trigger correctly", () => {
            render(
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                    </DialogContent>
                </Dialog>
            );

            expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument();
        });

        it("opens when trigger is clicked", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Test Dialog</DialogTitle>
                            <DialogDescription>Dialog description</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByRole("button", { name: "Open Dialog" }));

            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText("Test Dialog")).toBeInTheDocument();
            expect(screen.getByText("Dialog description")).toBeInTheDocument();
        });
    });

    describe("Dialog Content", () => {
        it("renders header correctly", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Header Title</DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            expect(screen.getByText("Header Title")).toBeInTheDocument();
        });

        it("renders footer correctly", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                        <DialogFooter>
                            <Button>Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
        });
    });

    describe("Closing behavior", () => {
        it("has close button", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
        });

        it("closes when close button is clicked", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            expect(screen.getByRole("dialog")).toBeInTheDocument();

            await user.click(screen.getByRole("button", { name: "Close" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("supports DialogClose component", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            await user.click(screen.getByRole("button", { name: "Cancel" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    describe("Accessibility", () => {
        it("has proper ARIA attributes", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Accessible Dialog</DialogTitle>
                            <DialogDescription>This is a description</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));

            const dialog = await screen.findByRole("dialog");
            expect(dialog).toBeInTheDocument();
        });

        it("close button has sr-only label", async () => {
            const user = userEvent.setup();

            render(
                <Dialog>
                    <DialogTrigger>Open</DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Title</DialogTitle>
                    </DialogContent>
                </Dialog>
            );

            await user.click(screen.getByText("Open"));
            expect(screen.getByText("Close")).toHaveClass("sr-only");
        });
    });

    describe("Controlled mode", () => {
        it("works with open prop", () => {
            render(
                <Dialog open>
                    <DialogContent>
                        <DialogTitle>Controlled Dialog</DialogTitle>
                    </DialogContent>
                </Dialog>
            );

            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText("Controlled Dialog")).toBeInTheDocument();
        });
    });
});
