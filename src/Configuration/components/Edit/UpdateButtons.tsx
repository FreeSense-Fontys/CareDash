interface UpdateButtonsProps {
    handleCancel: () => void
    handleSave: () => void
}

const UpdateButtons = ({ handleCancel, handleSave }: UpdateButtonsProps) => {
    return (
        <div className="flex justify-between pt-3 border-t">
            <button
                onClick={handleCancel}
                className="bg-gray-500 text-white text-lg px-7 py-2 rounded hover:bg-gray-600 cursor-pointer"
            >
                Cancel
            </button>

            <button
                onClick={handleSave}
                className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent cursor-pointer"
            >
                Save
            </button>
        </div>
    )
}
export default UpdateButtons
