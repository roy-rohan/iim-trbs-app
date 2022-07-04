<?php

include_once __DIR__ . '/Common/ModelUtils.php';

class Workshop
{

    use QueryUtils;

    // DB stuff
    private $conn;
    private $table = 'workshop';

    // Workshop Properties
    public $workshop_id;
    public $title;
    public $type;
    public $slug;
    public $image_url;
    public $timeline_image_url;
    public $short_description;
    public $full_description;
    public $organizer;
    public $duration;
    public $workshop_date;
    public $workshop_time;
    public $workshop_end_date;
    public $workshop_end_time;
    public $background_info;
    public $terms_condition;
    public $faq;
    public $contact;
    public $conclave;
    public $venue;
    public $view_order;
    public $price;
    public $is_active;
	public $visible;
    public $show_in_home_page;
    public $created_at;
    public $updated_at;

    // Constructor with DB
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get InterestedUsers
    public function read($data)
    {
        // Create query
        $query = 'SELECT e.*, i.path as image_url FROM ' . $this->table . ' e LEFT JOIN '
            . 'image i ON e.workshop_id = i.entity_id AND i.entity_type = "workshop" AND i.type = "workshop"';

        $query = $this->processFiltersAndOrderBy($query, $data);

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $this->executeQuery($stmt);

        return $stmt;
    }

    // Get Single Workshop
    public function read_single()
    {
        // Create query
        $query =
            'SELECT e.*, i.path as image_url FROM ' . $this->table . ' e LEFT JOIN '
            . 'image i ON e.workshop_id = i.entity_id AND i.entity_type = "workshop" AND i.type = "workshop"' . ' WHERE workshop_id = :workshop_id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(":workshop_id", $this->workshop_id);

        // Execute query
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        // Set properties
        $this->populateModelFields($row, ["timeline_image_url"]);
        $this->timeline_image_url = $this->get_timeline_image();
    }


    public function get_timeline_image()
    {
        // Create query
        $query =
            'SELECT timeline.path as timeline_image_url FROM ' . $this->table .
            ' e LEFT JOIN image timeline ON e.workshop_id = timeline.entity_id AND timeline.entity_type = "workshop" AND timeline.type = "workshop-timeline"'
            . ' WHERE workshop_id = :workshop_id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(":workshop_id", $this->workshop_id);

        // Execute query
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row["timeline_image_url"];
    }

    // Create IntestedUser
    public function create()
    {
        // Create query
        $ignoreList = ["timeline_image_url", "image_url", "workshop_id"];
        $query = $this->generateInsertQuery($ignoreList);

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->short_description = htmlspecialchars(strip_tags($this->short_description));
        $this->workshop_time = htmlspecialchars(strip_tags($this->workshop_time));
        $this->workshop_date = htmlspecialchars(strip_tags($this->workshop_date));
        $this->workshop_end_date = htmlspecialchars(strip_tags($this->workshop_end_date));
        $this->workshop_end_time = htmlspecialchars(strip_tags($this->workshop_end_time));
        $this->created_at = htmlspecialchars(strip_tags(date("Y-m-d H:i:s")));
        $this->updated_at = htmlspecialchars(strip_tags(date("Y-m-d H:i:s")));

        // Bind data
        $this->bindParams($stmt, $ignoreList);

        // Execute query
        if ($this->executeQuery($stmt)) {
            return
                $this->conn->lastInsertId();
        }

        return false;
    }

    // Update Workshop
    public function update()
    {
        // Create query
        $query = $this->generateUpdateQuery(
            "WHERE workshop_id = :workshop_id",
            ["timeline_image_url", "image_url", "workshop_id", "created_at"]
        );
        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->short_description = htmlspecialchars(strip_tags($this->short_description));
        $this->workshop_time = htmlspecialchars(strip_tags($this->workshop_time));
        $this->workshop_date = htmlspecialchars(strip_tags($this->workshop_date));
        $this->workshop_end_date = htmlspecialchars(strip_tags($this->workshop_end_date));
        $this->workshop_end_time = htmlspecialchars(strip_tags($this->workshop_end_time));
        $this->view_order = htmlspecialchars(strip_tags($this->view_order));
        $this->is_active = htmlspecialchars(strip_tags($this->is_active));
        $this->updated_at = htmlspecialchars(strip_tags(date("Y-m-d H:i:s")));

        $this->bindParams(
            $stmt,
            ["timeline_image_url", "image_url", "image_path", "created_at"]
        );

        // Execute query
        if ($this->executeQuery($stmt)) {
            return true;
        }

        return false;
    }

    // Delete Workshop
    public function delete()
    {
        // Create query
        $query = 'DELETE FROM ' . $this->table . ' WHERE workshop_id = :workshop_id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->workshop_id = htmlspecialchars(strip_tags($this->workshop_id));

        // Bind data
        $stmt->bindParam(':workshop_id', $this->workshop_id);

        // Execute query
        if ($this->executeQuery($stmt)) {
            return true;
        }

        return false;
    }

    public function getCategories()
    {
        $query = 'SELECT DISTINCT type FROM ' . $this->table;

        $stmt = $this->conn->prepare($query);

        // Execute query
        $this->executeQuery($stmt);

        return $stmt;
    }
}
